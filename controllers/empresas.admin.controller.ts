import { Request, Response } from 'express';
import * as adminEmpresasService from '../services/empresas.admin.service.js';

export async function getEmpresas(req: Request, res: Response) {
  const { search } = req.query;
  const empresas = await adminEmpresasService.getAll(search as string | undefined);
  res.json(empresas);
}

export async function updateStatusEmpresa(req: Request, res: Response) {
  const { id } = req.params;
  const { ativo } = req.body;

  const empresaAtualizada = await adminEmpresasService.updateStatus(Number(id), ativo);
  res.json(empresaAtualizada);
}

export async function updateEmpresa(req: Request, res: Response) {
  const { id } = req.params;
  const { nome, descricao } = req.body;
  const logo = req.file?.path;

  const empresaAtualizada = await adminEmpresasService.update(Number(id), {
    nome,
    descricao,
    logo,
  });

  res.json(empresaAtualizada);
}

export async function createEmpresa(req: Request, res: Response) {
  const { nome, descricao } = req.body;
  const logo = req.file?.path;

  const novaEmpresa = await adminEmpresasService.create({
    nome,
    descricao,
    logo,
  });
  res.status(201).json(novaEmpresa);
}

export const deleteEmpresa = async (req: Request, res: Response) => {
  const { id } = req.params;
  await adminEmpresasService.remove(Number(id));
  res.status(204).send();
};

export const restoreEmpresa = async (req: Request, res: Response) => {
  const { id } = req.params;
  const empresaRestaurada = await adminEmpresasService.restore(Number(id));
  res.json(empresaRestaurada);
};

export async function getLideresByEmpresa(req: Request, res: Response) {
  const { id } = req.params;
  const lideres = await adminEmpresasService.getLideresByEmpresa(Number(id));
  res.json(lideres);
}

export const associarNovoLider = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email } = req.body;
  await adminEmpresasService.associarLider(email, Number(id));
  res.status(200).json({ message: `Usuário com e-mail ${email} foi promovido a líder.` });
};