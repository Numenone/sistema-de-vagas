import { Request, Response, NextFunction } from 'express';
import * as empresaManagementService from '../services/empresa.management.service';

export const getMinhaEmpresaStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const empresaId = req.usuario?.empresaId;
    if (!empresaId) {
      // Se o líder não tem empresa, retorna zero para tudo.
      return res.json({ vagasAtivas: 0, novasCandidaturas: 0 });
    }

    const stats = await empresaManagementService.getStats(empresaId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const getMinhaEmpresa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const empresaId = req.usuario?.empresaId;
    if (!empresaId) {
      return res.status(404).json({ error: 'Líder não associado a nenhuma empresa.' });
    }
    const empresa = await empresaManagementService.getEmpresaByLiderId(req.usuario!.id);
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada.' });
    }
    res.json(empresa);
  } catch (error) {
    next(error);
  }
};

export const createMinhaEmpresa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { empresa, token } = await empresaManagementService.createEmpresa(req.usuario!.id, req.body, req.file?.path);
    res.status(201).json({ empresa, token });
  } catch (error) {
    next(error);
  }
};

export const updateMinhaEmpresa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const empresaId = req.usuario!.empresaId!;
    const empresaAtualizada = await empresaManagementService.updateEmpresa(empresaId, req.body, req.file?.path);
    res.json(empresaAtualizada);
  } catch (error) {
    next(error);
  }
};

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