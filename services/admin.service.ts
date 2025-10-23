import { prisma } from '../lib/prisma';

export async function getAllUsers() {
  return prisma.usuario.findMany({
    orderBy: { nome: 'asc' },
    select: {
      id: true,
      nome: true,
      email: true,
      tipo: true,
      ativo: true,
      fotoPerfil: true,
    },
  });
}

export async function updateUserPermission(id: number, tipo: 'candidato' | 'lider' | 'admin') {
  return prisma.usuario.update({ where: { id }, data: { tipo } });
}

export async function updateUserStatus(id: number, ativo: boolean) {
  return prisma.usuario.update({ where: { id }, data: { ativo } });
}