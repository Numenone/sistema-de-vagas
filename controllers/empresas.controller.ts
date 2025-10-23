import { Request, Response, NextFunction } from 'express';
import * as EmpresaService from '../services/empresa.service';

export const getAllEmpresas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const empresas = await EmpresaService.getAll();
    res.json(empresas);
  } catch (error) {
    next(error);
  }
};

export const getEmpresaById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const empresa = await EmpresaService.getById(Number(id));
    if (empresa) {
      res.json(empresa);
    } else {
      res.status(404).json({ error: 'Empresa não encontrada' });
    }
  } catch (error) {
    next(error);
  }
};

export const createEmpresa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const novaEmpresa = await EmpresaService.create(req.body);
    res.status(201).json(novaEmpresa);
  } catch (error) {
    next(error);
  }
};

export const updateEmpresa = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const empresaAtualizada = await EmpresaService.update(Number(id), req.body);
    res.json(empresaAtualizada);
  } catch (error) {
    next(error);
  }
};

export const deleteEmpresa = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await EmpresaService.remove(Number(id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};