import { Request, Response, NextFunction } from 'express';
import * as adminEmpresasService from '../services/empresas.admin.service.js';

export const getEmpresas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search as string | undefined;
    const empresas = await adminEmpresasService.getAll(search);
    res.json(empresas);
  } catch (error) {
    next(error);
  }
};

export const updateStatusEmpresa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { ativo } = req.body;
    const empresa = await adminEmpresasService.updateStatus(Number(id), ativo);
    res.json(empresa);
  } catch (error) {
    next(error);
  }
};

export const updateEmpresa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (req.file) data.logo = req.file.path;
    const empresa = await adminEmpresasService.update(Number(id), data);
    res.json(empresa);
  } catch (error) {
    next(error);
  }
};

export const deleteEmpresa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await adminEmpresasService.remove(Number(id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};