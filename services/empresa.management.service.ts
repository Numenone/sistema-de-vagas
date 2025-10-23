import { Usuario, Empresa } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO';

export const getStats = async (empresaId: number) => {
  const vagasAtivas = await prisma.vaga.count({
    where: {
      empresaId,
      ativa: true,
    },
  });

  const novasCandidaturas = await prisma.candidatura.count({
    where: {
      vaga: { empresaId },
      status: 'Enviada',
    },
  });

  return { vagasAtivas, novasCandidaturas };
};

export const getEmpresaByLiderId = async (liderId: number): Promise<Empresa | null> => {
  const lider = await prisma.usuario.findUnique({
    where: { id: liderId },
    include: { empresa: true },
  });
  return lider?.empresa || null;
};

export const createEmpresa = async (liderId: number, dados: { nome: string; descricao: string }, logoPath?: string): Promise<{ empresa: Empresa, token: string }> => {
  const lider = await prisma.usuario.findUnique({ where: { id: liderId } });
  if (lider?.empresaId) {
    const error = new Error('Este líder já está associado a uma empresa.');
    (error as any).statusCode = 400;
    throw error;
  }

  const novaEmpresa = await prisma.empresa.create({
    data: {
      nome: dados.nome,
      descricao: dados.descricao,
      logo: logoPath,
      lideres: {
        connect: { id: liderId },
      },
    },
  });

  // Atualiza o usuário para refletir a nova associação
  const usuarioAtualizado = await prisma.usuario.findUnique({ where: { id: liderId } });

  // Gera um novo token com o `empresaId` atualizado
  const novoToken = jwt.sign(
    { id: usuarioAtualizado!.id, tipo: usuarioAtualizado!.tipo, empresaId: usuarioAtualizado!.empresaId },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { empresa: novaEmpresa, token: novoToken };
};

export const updateEmpresa = async (empresaId: number, dados: { nome?: string; descricao?: string }, logoPath?: string): Promise<Empresa> => {
  const dataToUpdate: { nome?: string; descricao?: string; logo?: string } = {};
  if (dados.nome) dataToUpdate.nome = dados.nome;
  if (dados.descricao) dataToUpdate.descricao = dados.descricao;
  if (logoPath) dataToUpdate.logo = logoPath;

  const empresaAtualizada = await prisma.empresa.update({
    where: { id: empresaId },
    data: dataToUpdate,
  });

  return empresaAtualizada;
};

export async function getLideresByEmpresa(empresaId: number): Promise<Partial<Usuario>[]> {
  return prisma.usuario.findMany({
    where: {
      empresaId: empresaId,
      tipo: 'lider',
    },
    select: {
      id: true,
      nome: true,
      email: true,
      fotoPerfil: true,
    },
  });
}

export async function associarLider(email: string, empresaId: number): Promise<Usuario> {
  const usuarioParaAssociar = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuarioParaAssociar) {
    const error = new Error('Usuário não encontrado com este e-mail.');
    (error as any).statusCode = 404;
    throw error;
  }

  if (usuarioParaAssociar.tipo !== 'candidato') {
    const error = new Error(`Este usuário já é um "${usuarioParaAssociar.tipo}" e não pode ser associado.`);
    (error as any).statusCode = 400;
    throw error;
  }

  const usuarioAtualizado = await prisma.usuario.update({
    where: { id: usuarioParaAssociar.id },
    data: {
      tipo: 'lider',
      empresaId: empresaId,
    },
  });

  return usuarioAtualizado;
}