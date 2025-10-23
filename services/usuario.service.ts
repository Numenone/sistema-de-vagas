import { prisma } from '../lib/prisma';
import { Usuario, Prisma, UserType } from '@prisma/client';
import bcrypt from 'bcrypt';

export const getAll = async (query: any): Promise<Usuario[]> => {
  const { email, tipo } = query;
  const where: Prisma.UsuarioWhereInput = {};
  if (email) where.email = email as string;
  if (tipo) where.tipo = tipo as UserType;
  return prisma.usuario.findMany({ where });
};

export const getById = async (id: number): Promise<Usuario | null> => {
  return prisma.usuario.findUnique({ where: { id } });
};

export const getByEmailAndPassword = async (email: string, senha: string): Promise<Usuario | null> => {
  return prisma.usuario.findFirst({
    where: {
      email: { equals: email, mode: 'insensitive' },
      senha
    }
  });
};

export const create = async (data: Prisma.UsuarioCreateInput): Promise<Usuario> => {
  const salt = await bcrypt.genSalt(10);
  const senhaHash = await bcrypt.hash(data.senha, salt);

  return prisma.usuario.create({
    data: {
      ...data,
      senha: senhaHash,
    },
  });
};

export const update = async (id: number, data: Prisma.UsuarioUpdateInput): Promise<Usuario> => {
  return prisma.usuario.update({ where: { id }, data });
};

export const remove = async (id: number): Promise<Usuario> => {
  return prisma.usuario.delete({ where: { id } });
};