import { prisma } from '../lib/prisma.ts';
import { Empresa, Prisma } from '@prisma/client';

export const getAll = async (): Promise<Empresa[]> => {
  return prisma.empresa.findMany();
};

export const getById = async (id: number): Promise<Empresa | null> => {
  return prisma.empresa.findUnique({ where: { id } });
};

export const create = async (data: Prisma.EmpresaCreateInput): Promise<Empresa> => {
  return prisma.empresa.create({ data });
};

export const update = async (id: number, data: Prisma.EmpresaUpdateInput): Promise<Empresa> => {
  return prisma.empresa.update({ where: { id }, data });
};

export const remove = async (id: number): Promise<Empresa> => {
  return prisma.empresa.delete({ where: { id } });
};