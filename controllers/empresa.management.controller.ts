import { Request, Response, NextFunction } from 'express';
import * as empresaManagementService from '../services/empresa.management.service';

export const getLideres = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const empresaId = req.usuario!.empresaId!;
    const lideres = await empresaManagementService.getLideresByEmpresa(empresaId);
    res.json(lideres);
  } catch (error) {
    next(error);
  }
};

export const associarNovoLider = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const empresaId = req.usuario!.empresaId!;
    await empresaManagementService.associarLider(email, empresaId);
    res.status(200).json({ message: `Usuário com e-mail ${email} foi promovido a líder.` });
  } catch (error) {
    next(error);
  }
};