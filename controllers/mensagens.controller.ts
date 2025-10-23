import { Request, Response } from 'express';
import * as mensagensService from '../services/mensagens.service.js';

export async function getMensagensByCandidatura(req: Request, res: Response) {
  const { candidaturaId } = req.params;
  const usuarioLogado = req.usuario!;

  const mensagens = await mensagensService.getMensagensByCandidatura(Number(candidaturaId), usuarioLogado);
  res.json(mensagens);
}

export async function getUnreadCount(req: Request, res: Response) {
  const usuarioLogado = req.usuario!;
  const count = await mensagensService.getUnreadCount(usuarioLogado.id);
  res.json({ count });
}

export async function markAsRead(req: Request, res: Response) {
  const { candidaturaId } = req.params;
  const usuarioLogado = req.usuario!;

  await mensagensService.markAsRead(Number(candidaturaId), usuarioLogado.id);
  res.status(204).send();
}

export async function enviarMensagem(req: Request, res: Response) {
  const { conteudo, destinatarioId, candidaturaId } = req.body;
  const remetente = req.usuario!;

  if (!conteudo || !destinatarioId || !candidaturaId) {
    return res.status(400).json({ error: 'Conteúdo, destinatário e candidatura são obrigatórios.' });
  }

  const novaMensagem = await mensagensService.enviarMensagem({
    conteudo,
    destinatarioId: Number(destinatarioId),
    candidaturaId: Number(candidaturaId),
    remetente,
  });
  res.status(201).json(novaMensagem);
}