import { prisma } from '../lib/prisma';

export async function getDashboardData() {
  // Usando $transaction para executar todas as consultas em paralelo para melhor performance
  const [vagas, candidaturas, atividades] = await prisma.$transaction([
    prisma.vaga.findMany({
      where: { ativa: true },
      include: { empresa: { select: { nome: true } } },
    }),
    prisma.candidatura.findMany({
      include: {
        vaga: { select: { id: true, titulo: true } },
        usuario: { select: { id: true, nome: true } },
      },
    }),
    prisma.atividade.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5, // Limita a 5 atividades recentes
    }),
  ]);

  return { vagas, candidaturas, atividades };
}