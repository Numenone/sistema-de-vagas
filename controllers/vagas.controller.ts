import { Request, Response, NextFunction } from 'express';
import * as VagaService from '../services/vaga.service.js';

export const getAllVagas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vagas = await VagaService.getAll(req.query);
    res.json(vagas);
  } catch (error) {
    next(error);
  }
};

export const getVagaById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const vaga = await VagaService.getById(Number(id), req.query);
    if (vaga) {
      res.json(vaga);
    } else {
      res.status(404).json({ error: 'Vaga não encontrada' });
    }
  } catch (error) {
    next(error);
  }
};

export const getVagaByIdWithSimilares = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const result = await VagaService.getByIdWithSimilares(Number(id));
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: 'Vaga não encontrada' });
    }
  } catch (error) {
    next(error);
  }
};
export const createVaga = async (req: Request, res: Response, next: NextFunction) => {
  try {
        const dadosVaga = req.body;
        if (!dadosVaga.empresaId && req.usuario?.tipo === 'lider' && req.usuario.empresaId) {
        dadosVaga.empresaId = req.usuario.empresaId;
       }

    const novaVaga = await VagaService.create(dadosVaga);
    res.status(201).json(novaVaga);
  } catch (error) {
    next(error);
  }
};

export const updateVaga = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const vagaAtualizada = await VagaService.update(Number(id), req.body);
    res.json(vagaAtualizada);
  } catch (error) {
    next(error);
  }
};

export const deleteVaga = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await VagaService.remove(Number(id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};