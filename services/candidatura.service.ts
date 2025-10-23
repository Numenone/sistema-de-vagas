import { Candidatura, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export const getAll = async (query: any): Promise<Candidatura[]> => {
  const { usuarioId, vagaId, status, search, empresaId } = query;
  const where: Prisma.CandidaturaWhereInput = {};

  if (usuarioId) where.usuarioId = Number(usuarioId);
  if (vagaId) where.vagaId = Number(vagaId);
  if (empresaId) {
    where.vaga = { empresaId: Number(empresaId) };
  }
  if (status && status !== 'todas') {
    where.status = status;
  }
  if (search && typeof search === 'string') {
    where.OR = [
      { usuario: { nome: { contains: search, mode: 'insensitive' } } },
      { vaga: { titulo: { contains: search, mode: 'insensitive' } } },
      { vaga: { empresa: { nome: { contains: search, mode: 'insensitive' } } } },
    ];
  }

  return prisma.candidatura.findMany({
    where,
    include: {
      usuario: { select: { id: true, nome: true, email: true } },
      vaga: { select: { id: true, titulo: true, empresa: { select: { nome: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getById = async (id: number): Promise<Candidatura | null> => {
  return prisma.candidatura.findUnique({ where: { id } });
};

export const create = async (data: Prisma.CandidaturaCreateInput): Promise<Candidatura> => {
  return prisma.candidatura.create({ data });
};

export const update = async (id: number, data: Prisma.CandidaturaUpdateInput): Promise<Candidatura> => {
  return prisma.candidatura.update({ where: { id }, data });
};

export const remove = async (id: number): Promise<Candidatura> => {
  return prisma.candidatura.delete({ where: { id } });
};