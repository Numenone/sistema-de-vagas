import { Request, Response, NextFunction } from 'express';
import * as empresaManagementService from '../services/empresa.management.service';

export async function getLideres(req: Request, res: Response, next: NextFunction) {
  const empresaId = req.usuario!.empresaId!;
  const lideres = await empresaManagementService.getLideresByEmpresa(empresaId);
  res.status(200).json(lideres);
}

export async function associarNovoLider(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;
  const empresaId = req.usuario!.empresaId!;

  if (!email) {
    const error = new Error('O e-mail do usuário é obrigatório.');
    (error as any).statusCode = 400;
    throw error;
  }

  const usuarioAtualizado = await empresaManagementService.associarLider(email, empresaId);
  res.status(200).json({ message: `Usuário ${usuarioAtualizado.nome} associado como líder com sucesso!` });
}