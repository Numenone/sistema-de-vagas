import { Usuario } from '@prisma/client';
import { prisma } from '../lib/prisma';

export async function getLideresByEmpresa(empresaId: number): Promise<Partial<Usuario>[]> {
  return prisma.usuario.findMany({
    where: {
      empresaId: empresaId,
      tipo: 'lider',
    },
    select: {
      id: true,
      nome: true,
      email: true,
      fotoPerfil: true,
    },
  });
}

export async function associarLider(email: string, empresaId: number): Promise<Usuario> {
  const usuarioParaAssociar = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuarioParaAssociar) {
    const error = new Error('Usuário não encontrado com este e-mail.');
    (error as any).statusCode = 404;
    throw error;
  }

  if (usuarioParaAssociar.tipo !== 'candidato') {
    const error = new Error(`Este usuário já é um "${usuarioParaAssociar.tipo}" e não pode ser associado.`);
    (error as any).statusCode = 400;
    throw error;
  }

  const usuarioAtualizado = await prisma.usuario.update({
    where: { id: usuarioParaAssociar.id },
    data: {
      tipo: 'lider',
      empresaId: empresaId,
    },
  });

  return usuarioAtualizado;
}