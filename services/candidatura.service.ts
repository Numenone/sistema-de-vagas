import { prisma } from '../lib/prisma';
import { Candidatura, Prisma } from '@prisma/client';

export const getAll = async (query: any): Promise<Candidatura[]> => {
  const { usuarioId, vagaId } = query;
  const where: Prisma.CandidaturaWhereInput = {};
  if (usuarioId) where.usuarioId = Number(usuarioId);
  if (vagaId) where.vagaId = Number(vagaId);
  return prisma.candidatura.findMany({ where });
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