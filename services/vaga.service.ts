import { prisma } from '../lib/prisma';
import { Vaga, Prisma } from '@prisma/client';

export const getAll = async (query: any): Promise<Vaga[]> => {
  const { q, ativa, _expand } = query;
  const where: Prisma.VagaWhereInput = {};
  if (ativa === 'true') where.ativa = true;
  if (q) {
    where.OR = [
      { titulo: { contains: q as string, mode: 'insensitive' } },
      { descricao: { contains: q as string, mode: 'insensitive' } },
    ];
  }
  const include: Prisma.VagaInclude = {};
  if (_expand === 'empresa') include.empresa = true;
  return prisma.vaga.findMany({ where, include });
};

export const getById = async (id: number, query: any): Promise<Vaga | null> => {
  const { _expand } = query;
  const include: Prisma.VagaInclude = {};
  if (_expand === 'empresa') include.empresa = true;
  return prisma.vaga.findUnique({ where: { id }, include });
};

export const create = async (data: Prisma.VagaCreateInput): Promise<Vaga> => {
  return prisma.vaga.create({ data });
};

export const update = async (id: number, data: Prisma.VagaUpdateInput): Promise<Vaga> => {
  return prisma.vaga.update({ where: { id }, data });
};

export const remove = async (id: number): Promise<Vaga> => {
  return prisma.vaga.delete({ where: { id } });
};