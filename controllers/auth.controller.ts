import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import * as usuarioService from '../services/usuario.service';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, senha } = req.body;
    const result = await authService.login(email, senha);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateUsuario = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const dados = req.body;

  if (req.file) {
    dados.fotoPerfil = req.file.path;
  }

  // Garante que o usuário só pode atualizar o próprio perfil (a menos que seja admin)
  if (req.usuario?.tipo !== 'admin' && req.usuario?.id !== Number(id)) {
    return res.status(403).json({ error: 'Acesso negado.' });
  }

  try {
    const usuarioAtualizado = await authService.updateUsuario(Number(id), dados);
    res.json(usuarioAtualizado);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.status(200).json({ message: 'Se o e-mail existir em nossa base, um link para redefinição de senha foi enviado.' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, novaSenha } = req.body;
    await authService.resetPassword(token, novaSenha);
    res.status(200).json({ message: 'Senha redefinida com sucesso.' });
  } catch (error) {
    next(error);
  }
};

export const getCandidatoProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const candidato = await usuarioService.getById(Number(id));

    if (!candidato || candidato.tipo !== 'candidato') {
      return res.status(404).json({ error: 'Perfil de candidato não encontrado.' });
    }

    // Remove a senha do objeto antes de enviar
    const { senha: _senha, ...perfil } = candidato;

    res.json(perfil);
  } catch (error) {
    next(error);
  }
};