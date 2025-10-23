import { prisma } from '../lib/prisma.js';
import { Vaga, Prisma } from '@prisma/client';

export const getAll = async (query: any): Promise<{ vagas: Vaga[], totalPages: number, currentPage: number }> => {
  const { q, ativa, _expand, adminSearch, page = 1 } = query;
  const where: Prisma.VagaWhereInput = {
    empresa: adminSearch ? undefined : { ativo: true },
  };

  if (!adminSearch) {
    where.ativa = true;
  } else {
    if (ativa === 'true') {
      where.ativa = true;
    } else if (ativa === 'false') {
      where.ativa = false;
    }
  }

  if (q) {
    where.OR = [
      { titulo: { contains: q as string, mode: 'insensitive' } },
      { descricao: { contains: q as string, mode: 'insensitive' } },
    ];
  }
  const include: Prisma.VagaInclude = {};
  if (_expand === 'empresa') include.empresa = true;

  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const [vagas, totalVagas] = await prisma.$transaction([
    prisma.vaga.findMany({ where, include, take: pageSize, skip }),
    prisma.vaga.count({ where }),
  ]);

  const totalPages = Math.ceil(totalVagas / pageSize);

  return { vagas, totalPages, currentPage: page };
};

export const getById = async (id: number, query: any): Promise<Vaga | null> => {
  const { _expand } = query;
  const include: Prisma.VagaInclude = {};
  if (_expand === 'empresa') include.empresa = true;
  return prisma.vaga.findUnique({ where: { id }, include });
};

export const getByIdWithSimilares = async (id: number): Promise<{ vaga: Vaga; similares: Vaga[] } | null> => {
  const vaga = await prisma.vaga.findUnique({
    where: { id },
    include: { empresa: true, habilidades: true },
  });

  if (!vaga) return null;

  const similares = await prisma.vaga.findMany({
    where: {
      id: { not: id },
      empresaId: vaga.empresaId, // Vagas da mesma empresa
      ativa: true,
    },
    take: 3,
    include: {
      empresa: { select: { nome: true, logo: true } },
    },
  });

  return { vaga, similares };
};

export const create = async (data: Prisma.VagaCreateInput): Promise<Vaga> => {
  return prisma.vaga.create({ data });
};

export const update = async (id: number, data: any): Promise<Vaga> => {
  const { habilidades, ...vagaData } = data;

  if (habilidades) {
    vagaData.habilidades = {
      set: [],
      connectOrCreate: habilidades.map((habilidade: string) => {
        return {
          where: { nome: habilidade },
          create: { nome: habilidade },
        };
      }),
    };
  }

  return prisma.vaga.update({
    where: { id },
    data: vagaData,
  });
};

export const remove = async (id: number): Promise<Vaga> => {
  return prisma.vaga.delete({ where: { id } });
};