import type { VagaType } from './VagaType';
import type { CandidaturaType } from './CandidaturaType';
import { Briefcase, FileText } from 'lucide-react';

// --- Tipos de Dados ---

export type PieChartData = {
  x: string;
  y: number;
  name: string;
};

export type BarChartData = {
  x: string;
  y: number;
};

export type ChartData = {
  porEmpresa: PieChartData[];
  porStatus: PieChartData[];
  porSalario: PieChartData[];
  topVagas: BarChartData[];
  porModalidade: PieChartData[];
};

export type TimelineItem = {
  id: string;
  type: 'vaga' | 'candidatura';
  date: string;
  text: string;
  Icon: React.ElementType;
};

// --- Funções de Processamento ---

export const processVagasPorEmpresa = (vagas: VagaType[]): PieChartData[] => {
  const contagem = vagas.reduce((acc, vaga) => {
    const nomeEmpresa = vaga.empresa?.nome || 'N/A';
    acc[nomeEmpresa] = (acc[nomeEmpresa] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(contagem).map(([nome, total]) => ({
    x: nome,
    y: total,
    name: `${nome}: ${total}`,
  }));
};

export const processCandidaturasPorStatus = (candidaturas: CandidaturaType[]): PieChartData[] => {
  const contagem = candidaturas.reduce((acc, candidatura) => {
    acc[candidatura.status] = (acc[candidatura.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(contagem).map(([status, total]) => ({
    x: status,
    y: total,
    name: `${status}: ${total}`,
  }));
};

export const processVagasPorSalario = (vagas: VagaType[]): PieChartData[] => {
  const faixas = {
    'Até R$3k': (v: VagaType) => v.salario <= 3000,
    'R$3k - R$6k': (v: VagaType) => v.salario > 3000 && v.salario <= 6000,
    'R$6k - R$10k': (v: VagaType) => v.salario > 6000 && v.salario <= 10000,
    'Acima de R$10k': (v: VagaType) => v.salario > 10000,
  };

  const contagem = Object.keys(faixas).reduce((acc, faixa) => {
    acc[faixa] = vagas.filter(faixas[faixa as keyof typeof faixas]).length;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(contagem).map(([faixa, total]) => ({
    x: faixa,
    y: total,
    name: `${faixa}: ${total}`,
  }));
};

export const processTopVagas = (candidaturas: CandidaturaType[], vagas: VagaType[]): BarChartData[] => {
  const contagem = candidaturas.reduce((acc, cand) => {
    acc[cand.vagaId] = (acc[cand.vagaId] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return Object.entries(contagem)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([vagaId, total]) => {
      const vaga = vagas.find(v => v.id === Number(vagaId));
      return { x: vaga?.titulo.substring(0, 15) + '...' || `Vaga ${vagaId}`, y: total };
    });
};

export const processVagasPorModalidade = (vagas: VagaType[]): PieChartData[] => {
  const contagem = vagas.reduce((acc, vaga) => {
    const modalidade = vaga.modalidade || 'N/A';
    acc[modalidade] = (acc[modalidade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(contagem).map(([modalidade, total]) => ({
    x: modalidade,
    y: total,
    name: `${modalidade}: ${total}`,
  }));
};

export const processTimeline = (vagas: VagaType[], candidaturas: CandidaturaType[]): TimelineItem[] => {
  const vagasRecentes = vagas.slice(0, 3).map(v => ({ id: `v-${v.id}`, type: 'vaga' as const, date: v.createdAt.toString(), text: `Nova vaga: ${v.titulo}`, Icon: Briefcase }));
  const candidaturasRecentes = candidaturas.slice(0, 2).map(c => ({ id: `c-${c.id}`, type: 'candidatura' as const, date: c.createdAt, text: `${c.usuario.nome} se candidatou para ${c.vaga.titulo}`, Icon: FileText }));

  return [...vagasRecentes, ...candidaturasRecentes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const formatTimelineDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};