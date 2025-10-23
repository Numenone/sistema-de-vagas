import { prisma } from '../lib/prisma';

export async function getAll() {
  return prisma.habilidade.findMany({ orderBy: { nome: 'asc' } });
}