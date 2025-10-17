import type { VagaType } from './VagaType';
import type { CandidaturaType } from './CandidaturaType';
import { Briefcase, UserPlus } from 'lucide-react';

export type PieChartData = { x: string; y: number; name: string };
export type BarChartData = { x: string; y: number; label: string };

export type ChartData = {
  porEmpresa: PieChartData[];
  porStatus: PieChartData[];
  porSalario: PieChartData[];
  topVagas: BarChartData[];
};

export type TimelineItem = {
  id: string;
  type: 'vaga' | 'candidatura';
  date: Date;
  Icon: React.ElementType;
  text: string;
};

export function processVagasPorEmpresa(vagas: VagaType[]): PieChartData[] {
  const countMap = new Map<string, number>();
  vagas.forEach(vaga => {
    const nomeEmpresa = vaga.empresa?.nome || 'Sem Empresa';
    countMap.set(nomeEmpresa, (countMap.get(nomeEmpresa) || 0) + 1);
  });
  return Array.from(countMap.entries()).map(([nome, count]) => ({
    x: nome,
    y: count,
    name: `${nome} (${count})`
  }));
}

export function processCandidaturasPorStatus(candidaturas: CandidaturaType[]): PieChartData[] {
  const countMap = new Map<string, number>();
  candidaturas.forEach(candidatura => {
    const status = candidatura.status || 'indefinido';
    countMap.set(status, (countMap.get(status) || 0) + 1);
  });
  return Array.from(countMap.entries()).map(([status, count]) => ({
    x: status,
    y: count,
    name: `${status} (${count})`
  }));
}

const faixasSalariais: Record<string, (s: number) => boolean> = {
  'Até R$3k': (s) => s <= 3000,
  'R$3k - R$6k': (s) => s > 3000 && s <= 6000,
  'R$6k - R$10k': (s) => s > 6000 && s <= 10000,
  'Acima de R$10k': (s) => s > 10000,
};

export function processVagasPorSalario(vagas: VagaType[]): PieChartData[] {
  const countMap = new Map<string, number>();
  vagas.forEach(vaga => {
    for (const faixa in faixasSalariais) {
      if (vaga.salario && faixasSalariaisfaixa) {
        countMap.set(faixa, (countMap.get(faixa) || 0) + 1);
        break;
      }
    }
  });
  return Array.from(countMap.entries()).map(([faixa, count]) => ({
    x: faixa,
    y: count,
    name: `${faixa} (${count})`
  }));
}

export function processTopVagas(candidaturas: CandidaturaType[], vagas: VagaType[]): BarChartData[] {
  const vagasMap = new Map(vagas.map(v => [v.id, v]));
  const countMap = new Map<string, number>();

  candidaturas.forEach(candidatura => {
    const vaga = vagasMap.get(candidatura.vagaId);
    if (vaga) {
      countMap.set(vaga.titulo, (countMap.get(vaga.titulo) || 0) + 1);
    }
  });

  return Array.from(countMap.entries())
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5)
    .map(([titulo, count]) => {
      const nomeCurto = titulo.length > 15 ? `${titulo.substring(0, 15)}...` : titulo;
      return { x: nomeCurto, y: count, label: `${nomeCurto}\n(${count})` };
    });
}

export function processTimeline(vagas: VagaType[], candidaturas: CandidaturaType[]): TimelineItem[] {
    const recentVagas = vagas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);

    const vagaActivities: TimelineItem[] = recentVagas.map(vaga => ({
      id: `vaga-${vaga.id}`,
      type: 'vaga',
      date: new Date(vaga.createdAt),
      Icon: Briefcase,
      text: `Nova vaga: "${vaga.titulo}" na ${vaga.empresa?.nome || 'empresa desconhecida'}.`
    }));
  
    const candidaturaActivities: TimelineItem[] = candidaturas.map(candidatura => ({
      id: `cand-${candidatura.id}`,
      type: 'candidatura',
      date: new Date(candidatura.createdAt),
      Icon: UserPlus,
      text: `${candidatura.usuario?.nome || 'Candidato desconhecido'} se candidatou para "${candidatura.vaga?.titulo || 'vaga desconhecida'}".`
    }));
  
    return [...vagaActivities, ...candidaturaActivities]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);
  }

export function formatTimelineDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }