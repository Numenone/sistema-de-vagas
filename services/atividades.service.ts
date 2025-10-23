import { prisma } from '../lib/prisma.js';

export async function getAtividadesRecentes() {
  const limite = 7;

  const novasVagas = await prisma.vaga.findMany({
    take: limite,
    orderBy: { createdAt: 'desc' },
    where: { ativa: true },
    include: { empresa: { select: { nome: true } } },
  });

  const novasCandidaturas = await prisma.candidatura.findMany({
    take: limite,
    orderBy: { createdAt: 'desc' },
    include: {
      vaga: { select: { id: true, titulo: true } },
      usuario: { select: { nome: true } },
    },
  });

  const atividadesVagas = novasVagas.map(vaga => ({
    id: `vaga-${vaga.id}`, type: 'vaga', data: vaga.createdAt,
    texto: `Nova vaga: ${vaga.titulo}`, subtexto: `na empresa ${vaga.empresa.nome}`,
    link: `/detalhes/${vaga.id}`,
  }));

  const atividadesCandidaturas = novasCandidaturas.map(candidatura => ({
    id: `candidatura-${candidatura.id}`, type: 'candidatura', data: candidatura.createdAt,
    texto: `${candidatura.usuario.nome} se candidatou`, subtexto: `para a vaga de ${candidatura.vaga.titulo}`,
    link: `/detalhes/${candidatura.vaga.id}`,
  }));

  return [...atividadesVagas, ...atividadesCandidaturas].sort((a, b) => b.data.getTime() - a.data.getTime()).slice(0, 10);
}