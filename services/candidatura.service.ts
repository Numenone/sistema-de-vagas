import { Candidatura, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

export const getAll = async (query: any): Promise<Candidatura[]> => {
  const { usuarioId, vagaId, status, search, empresaId } = query;
  const where: Prisma.CandidaturaWhereInput = {};

  if (usuarioId) where.usuarioId = Number(usuarioId);
  if (vagaId) where.vagaId = Number(vagaId);
  if (empresaId) {
    where.vaga = { empresaId: Number(empresaId) };
  }
  if (status && status !== 'todas') {
    const statusMap: { [key: string]: any } = {
      "Em Análise": "Em_Análise",
      "Enviada": "Enviada",
      "Aprovada": "Aprovada",
      "Rejeitada": "Rejeitada",
    };
    where.status = statusMap[status] || status;
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
      vaga: { 
        include: { 
          empresa: { 
            include: { 
              lideres: true 
            } 
          } 
        } 
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getById = async (id: number): Promise<Candidatura | null> => {
  return prisma.candidatura.findUnique({ where: { id } });
};

export const create = async (data: Prisma.CandidaturaCreateInput): Promise<Candidatura> => {
  const createData = { ...data, status: 'Enviada' as const };

  return prisma.candidatura.create({ data: createData });
};

export const update = async (id: number, data: any): Promise<Candidatura> => {
  const { status, ...rest } = data;
  const updateData: Prisma.CandidaturaUpdateInput = { ...rest };

  if (status) {
    const statusMap: { [key: string]: any } = {
      "Em Análise": "Em_Análise",
      "Enviada": "Enviada",
      "Aprovada": "Aprovada",
      "Rejeitada": "Rejeitada",
    };
    updateData.status = statusMap[status] || status;
  }

  return prisma.candidatura.update({ where: { id }, data: updateData });
};

export const remove = async (id: number): Promise<Candidatura> => {
  return prisma.candidatura.delete({ where: { id } });
};