import { Prisma, Usuario } from '@prisma/client';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendPasswordResetEmail } from './email.service';
import * as usuarioService from './usuario.service';

const JWT_SECRET = process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO';

async function findUserByEmail(email: string) {
  return prisma.usuario.findUnique({
    where: { email: email.toLowerCase() },
  });
}

export async function login(email: string, senha: string): Promise<{ usuario: Partial<Usuario>, token: string }> {
  const usuario = await findUserByEmail(email);

  if (!usuario) {
    const error = new Error('Email ou senha incorretos.');
    (error as any).statusCode = 401;
    throw error;
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    const error = new Error('Email ou senha incorretos.');
    (error as any).statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: usuario.id, tipo: usuario.tipo, empresaId: usuario.empresaId }, 
    JWT_SECRET, 
    { expiresIn: '1d' }
  );

  const { senha: _, ...usuarioSemSenha } = usuario;

  return { usuario: usuarioSemSenha, token };
}

export async function createUsuario(data: Prisma.UsuarioCreateInput): Promise<Partial<Usuario>> {
  // Reutiliza o serviço de usuário que já faz o hash da senha
  const novoUsuario = await usuarioService.create({
    ...data,
    email: data.email.toLowerCase(),
  });

  const { senha: _, ...usuarioSemSenha } = novoUsuario;
  return usuarioSemSenha;
}

export async function updateUsuario(id: number, data: Prisma.UsuarioUpdateInput): Promise<Partial<Usuario>> {
  if (data.senha && typeof data.senha === 'string') {
    const salt = await bcrypt.genSalt(10);
    data.senha = await bcrypt.hash(data.senha, salt);
  }

  const usuarioAtualizado = await prisma.usuario.update({
    where: { id },
    data,
  });

  const { senha: _, ...usuarioSemSenha } = usuarioAtualizado;
  return usuarioSemSenha;
}

export async function forgotPassword(email: string): Promise<void> {
  const usuario = await findUserByEmail(email);
  if (!usuario) return; // Não revele se o usuário existe ou não

  const resetToken = crypto.randomBytes(20).toString('hex');
  const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { passwordResetToken, passwordResetExpires },
  });

  // Envia o e-mail de redefinição de senha
  await sendPasswordResetEmail(usuario.email, resetToken);
}

export async function resetPassword(token: string, novaSenha: string): Promise<void> {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const usuario = await prisma.usuario.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { gt: new Date() },
    },
  });

  if (!usuario) {
    const error = new Error('Token inválido ou expirado.');
    (error as any).statusCode = 400;
    throw error;
  }

  // Hash da nova senha
  const salt = await bcrypt.genSalt(10);
  const senhaHash = await bcrypt.hash(novaSenha, salt);

  // Atualiza o usuário com a nova senha e limpa os tokens de reset
  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { senha: senhaHash, passwordResetToken: null, passwordResetExpires: null },
  });
}