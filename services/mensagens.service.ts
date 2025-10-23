import { Usuario, Prisma } from '@prisma/client';
import { sendPushNotification } from './push.service';
import { prisma } from '../lib/prisma';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

type MensagemComRemetente = Prisma.MensagemGetPayload<{
  include: { remetente: { select: { id: true; nome: true; fotoPerfil: true } } };
}>;

export async function getMensagensByCandidatura(candidaturaId: number, usuarioLogado: Usuario): Promise<MensagemComRemetente[]> {
  const candidatura = await prisma.candidatura.findUnique({
    where: { id: candidaturaId },
    include: {
      vaga: { include: { empresa: { include: { lideres: { take: 1 } } } } },
    },
  });

  if (!candidatura) {
    const error = new Error('Candidatura não encontrada.');
    (error as any).statusCode = 404;
    throw error;
  }

  const isCandidato = usuarioLogado.id === candidatura.usuarioId;
  const isLiderDaEmpresa = usuarioLogado.tipo === 'lider' && usuarioLogado.empresaId === candidatura.vaga.empresaId;

  if (!isCandidato && !isLiderDaEmpresa) {
    const error = new Error('Acesso negado.');
    (error as any).statusCode = 403;
    throw error;
  }

  return prisma.mensagem.findMany({
    where: { candidaturaId },
    orderBy: { createdAt: 'asc' },
    include: { remetente: { select: { id: true, nome: true, fotoPerfil: true } } },
  });
}

export async function getUnreadCount(usuarioId: number): Promise<number> {
  return prisma.mensagem.count({
    where: { destinatarioId: usuarioId, lida: false },
  });
}

export async function markAsRead(candidaturaId: number, usuarioId: number): Promise<void> {
  await prisma.mensagem.updateMany({
    where: { candidaturaId, destinatarioId: usuarioId },
    data: { lida: true },
  });
}

export async function enviarMensagem(data: { conteudo: string; destinatarioId: number; candidaturaId: number; remetente: Usuario }) {
  const { conteudo, destinatarioId, candidaturaId, remetente } = data;

  const candidatura = await prisma.candidatura.findUnique({
    where: { id: candidaturaId },
    include: { vaga: { include: { empresa: { include: { lideres: true } } } } },
  });

  if (!candidatura) {
    const error = new Error('Candidatura não encontrada.');
    (error as any).statusCode = 404;
    throw error;
  }

  const isDestinatarioValido = destinatarioId === candidatura.usuarioId || candidatura.vaga.empresa.lideres.some(l => l.id === destinatarioId);
  if (!isDestinatarioValido) {
    throw new Error('Destinatário inválido para esta candidatura.');
  }
  const novaMensagem = await prisma.mensagem.create({
    data: {
      conteudo,
      remetenteId: remetente.id,
      destinatarioId,
      candidaturaId,
    },
    include: { remetente: { select: { id: true, nome: true, fotoPerfil: true } } },
  });

  await pusher.trigger(`presence-candidatura-${candidaturaId}`, 'new_message', novaMensagem);

  const destinatarioSubscriptions = await prisma.pushSubscription.findMany({
    where: { usuarioId: destinatarioId },
  });

  if (destinatarioSubscriptions.length > 0) {
    const payload = JSON.stringify({
      title: `Nova mensagem de ${remetente.nome}`,
      body: novaMensagem.conteudo,
      icon: remetente.fotoPerfil || '/icon.png',
      data: { url: `/candidaturas?candidaturaId=${candidaturaId}` },
    });
    destinatarioSubscriptions.forEach(sub => sendPushNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload));
  }

  return novaMensagem;
}