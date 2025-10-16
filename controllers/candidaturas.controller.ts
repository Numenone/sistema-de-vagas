import { Request, Response, NextFunction } from 'express';
import * as CandidaturaService from '../services/candidatura.service';

export const getAllCandidaturas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const candidaturas = await CandidaturaService.getAll(req.query);
    res.json(candidaturas);
  } catch (error) {
    next(error);
  }
};

export const getCandidaturaById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const candidatura = await CandidaturaService.getById(Number(id));
    if (candidatura) {
      res.json(candidatura);
    } else {
      res.status(404).json({ error: 'Candidatura não encontrada' });
    }
  } catch (error) {
    next(error);
  }
};

export const createCandidatura = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const novaCandidatura = await CandidaturaService.create(req.body);
    res.status(201).json(novaCandidatura);
  } catch (error) {
    next(error);
  }
};

export const updateCandidatura = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const candidaturaAtualizada = await CandidaturaService.update(Number(id), req.body);
    res.json(candidaturaAtualizada);
  } catch (error) {
    next(error);
  }
};

export const deleteCandidatura = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await CandidaturaService.remove(Number(id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};