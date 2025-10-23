import { Request, Response, NextFunction } from 'express';
import * as UsuarioService from '../services/usuario.service';

export const getAllUsuarios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuarios = await UsuarioService.getAll(req.query);
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
};

export const getUsuarioById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const usuario = await UsuarioService.getById(Number(id));
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

export const createUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const novoUsuario = await UsuarioService.create(req.body);
    res.status(201).json(novoUsuario);
  } catch (error) {
    next(error);
  }
};

export const loginUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, senha } = req.body;
    const usuario = await UsuarioService.getByEmailAndPassword(email, senha);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(401).json({ error: 'Email ou senha incorretos' });
    }
  } catch (error) {
    next(error);
  }
};

export const updateUsuario = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const usuarioAtualizado = await UsuarioService.update(Number(id), req.body);
    res.json(usuarioAtualizado);
  } catch (error) {
    next(error);
  }
};

export const deleteUsuario = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await UsuarioService.remove(Number(id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};