import { Request, Response, NextFunction } from 'express';
import * as adminService from '../services/admin.service';

export const getUsuarios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuarios = await adminService.getAllUsers();
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
};

export const updatePermissaoUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { tipo } = req.body;
    const usuario = await adminService.updateUserPermission(Number(id), tipo);
    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

export const updateStatusUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { ativo } = req.body;
    const usuario = await adminService.updateUserStatus(Number(id), ativo);
    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

export const softDeleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const usuario = await adminService.softDeleteUser(Number(id));
    res.json(usuario);
  } catch (error) {
    next(error);
  }
};