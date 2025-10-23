import { prisma } from '../lib/prisma';

export const getOverallStats = async () => {
  // Executa todas as consultas em paralelo para melhor performance
  const [
    totalVagas,
    totalCandidatos,
    totalCandidaturas,
    totalEmpresas,
    vagas,
    candidaturas,
  ] = await prisma.$transaction([
    prisma.vaga.count({ where: { ativa: true } }),
    prisma.usuario.count({ where: { tipo: 'candidato' } }),
    prisma.candidatura.count(),
    prisma.empresa.count(),
    prisma.vaga.findMany({
      include: {
        empresa: true,
        habilidades: true,
        _count: { select: { candidaturas: true } },
      },
    }),
    prisma.candidatura.findMany({
      include: {
        vaga: { select: { titulo: true } },
        usuario: { select: { nome: true } },
      },
    }),
  ]);

  return {
    stats: { totalVagas, totalCandidatos, totalCandidaturas, totalEmpresas },
    vagas,
    candidaturas,
  };
};