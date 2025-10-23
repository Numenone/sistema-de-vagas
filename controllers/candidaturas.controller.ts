import { Request, Response} from 'express';
import * as CandidaturaService from '../services/candidatura.service';

export const getAllCandidaturasByEmpresa = async (req: Request, res: Response) => {
  if (req.usuario?.tipo !== 'lider' || !req.usuario.empresaId) {
    return res.status(403).json({ error: 'Acesso negado. Rota exclusiva para líderes de empresa.' });
  }
  const query = { ...req.query, empresaId: req.usuario.empresaId };
  const candidaturas = await CandidaturaService.getAll(query);
  res.json(candidaturas);
};

export const getAllCandidaturasByUsuario = async (req: Request, res: Response) => {
  if (req.usuario?.id !== Number(req.params.usuarioId)) {
    return res.status(403).json({ error: 'Acesso negado.' });
  }
  const candidaturas = await CandidaturaService.getAll({ ...req.query, usuarioId: req.usuario.id });
  res.json(candidaturas);
};

export const getAllCandidaturas = async (req: Request, res: Response) => {
  const candidaturas = await CandidaturaService.getAll(req.query);
  res.json(candidaturas);
};

export const createCandidatura = async (req: Request, res: Response) => {
  const novaCandidatura = await CandidaturaService.create(req.body);
  res.status(201).json(novaCandidatura);
};

export const updateCandidatura = async (req: Request, res: Response) => {
  if (req.usuario?.tipo !== 'admin' && req.usuario?.tipo !== 'lider') {
    return res.status(403).json({ error: 'Acesso negado.' });
  }
  const candidaturaAtualizada = await CandidaturaService.update(Number(req.params.id), req.body);
  res.json(candidaturaAtualizada);
};