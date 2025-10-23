import { prisma } from '../lib/prisma';

export async function getFavoritosByUsuario(usuarioId: number) {
  const usuarioComFavoritos = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    include: {
      vagasFavoritas: {
        include: { empresa: true },
      },
    },
  });
  return usuarioComFavoritos?.vagasFavoritas || [];
}

export async function addFavorito(usuarioId: number, vagaId: number) {
  return prisma.usuario.update({
    where: { id: usuarioId },
    data: { vagasFavoritas: { connect: { id: vagaId } } },
  });
}

export async function removeFavorito(usuarioId: number, vagaId: number) {
  return prisma.usuario.update({
    where: { id: usuarioId },
    data: { vagasFavoritas: { disconnect: { id: vagaId } } },
  });
}