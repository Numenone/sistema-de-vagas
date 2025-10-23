import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export async function getAll(search?: string) {
  const whereClause: Prisma.EmpresaWhereInput = {};

  if (search) {
    whereClause.OR = [
      { nome: { contains: search, mode: 'insensitive' } },
      { descricao: { contains: search, mode: 'insensitive' } },
    ];
  }

  return prisma.empresa.findMany({
    where: whereClause,
    select: {
      id: true,
      nome: true,
      descricao: true,
      logo: true,
      ativo: true,
      _count: {
        select: {
          lideres: true,
          vagas: { where: { ativa: true } },
        },
      },
    },
    orderBy: { nome: 'asc' },
  });
}

export async function updateStatus(id: number, ativo: boolean) {
  if (typeof ativo !== 'boolean') {
    const error = new Error('O campo "ativo" deve ser um booleano.');
    (error as any).statusCode = 400;
    throw error;
  }

  return prisma.$transaction(async (tx) => {
    const updatedEmpresa = await tx.empresa.update({
      where: { id },
      data: { ativo },
    });

    if (ativo === false) {
      await tx.vaga.updateMany({
        where: { empresaId: id },
        data: { ativa: false },
      });
    }

    return updatedEmpresa;
  });
}

export async function update(id: number, data: { nome?: string; descricao?: string; logo?: string }) {
  if (Object.keys(data).length === 0) {
    const error = new Error('Nenhum dado para atualizar.');
    (error as any).statusCode = 400;
    throw error;
  }
  return prisma.empresa.update({ where: { id }, data });
}

export async function remove(id: number) {
  // Em vez de deletar, vamos desativar a empresa e suas vagas.
  return updateStatus(id, false);
}

export async function restore(id: number) {
  // Reativa a empresa. As vagas não são reativadas automaticamente.
  return updateStatus(id, true);
}

export async function getLideresByEmpresa(empresaId: number) {
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

export async function associarLider(email: string, empresaId: number) {
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

  return prisma.usuario.update({
    where: { id: usuarioParaAssociar.id },
    data: {
      tipo: 'lider',
      empresaId: empresaId,
    },
  });
}