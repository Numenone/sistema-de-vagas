import { prisma } from '../lib/prisma';
import { Empresa, Prisma } from '@prisma/client';

export const getAll = async (): Promise<Empresa[]> => {
  return prisma.empresa.findMany({
    where: { ativo: true }, // Retorna apenas empresas ativas
  });
};

export const getById = async (id: number): Promise<Empresa | null> => {
  return prisma.empresa.findUnique({ where: { id } });
};

export const getByIdWithVagas = async (id: number, query: { page?: string, limit?: string }) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 6; // Define um limite padrão de 6 vagas por página
  const skip = (page - 1) * limit;

  const [empresa, totalVagas] = await prisma.$transaction([
    prisma.empresa.findUnique({
      where: { id },
      include: {
        vagas: {
          where: { ativa: true },
          take: limit,
          skip: skip,
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
    prisma.vaga.count({ where: { empresaId: id, ativa: true } }),
  ]);

  if (!empresa) return null;

  return {
    ...empresa,
    totalVagas,
    totalPages: Math.ceil(totalVagas / limit),
    currentPage: page,
  };
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