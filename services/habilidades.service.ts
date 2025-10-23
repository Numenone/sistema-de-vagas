import { prisma } from '../lib/prisma.js';

export async function getAll() {
  return prisma.habilidade.findMany({ orderBy: { nome: 'asc' } });
}