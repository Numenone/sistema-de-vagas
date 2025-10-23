import React, { useEffect, useState, useMemo, FC } from 'react';
import { VictoryPie, VictoryLegend, VictoryLabel, VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from 'victory';
import { 
  Briefcase, 
  Clock, 
  FileText,
  BarChart3,
  PieChart,
  Wallet,
  Users,
  Building2,
  ClipboardList
} from 'lucide-react'; 
import {
  type ChartData,
  type TimelineItem,
  type PieChartData,
  processVagasPorEmpresa,
  processCandidaturasPorStatus,
  processVagasPorSalario,
  processTopVagas,
  processTimeline,
  processVagasPorModalidade, // Adicionando a função que faltava
  formatTimelineDate,
} from '../utils/dashboard.utils';

type ChartType = 'empresa' | 'status' | 'salario' | 'topVagas' | 'modalidade';

const apiUrl = import.meta.env.VITE_API_URL;

// --- Tema Customizado para os Gráficos ---
const chartColors = [
  "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#6366F1", "#F97316"
];

const customTheme = {
  ...VictoryTheme.material,
  pie: {
    ...VictoryTheme.material.pie,
    colorScale: chartColors as any, // Cast to any to satisfy type checking
    style: {
      ...VictoryTheme.material.pie?.style,
      labels: {
        ...VictoryTheme.material.pie?.style?.labels,
        fontSize: 14,
        fill: 'white',
        fontWeight: 'bold' as any, // Cast to any
        stroke: 'rgba(0,0,0,0.2)' as any, // Cast to any
        strokeWidth: 1 as any, // Cast to any
      },
    },
  },
  legend: {
    ...VictoryTheme.material.legend,
    colorScale: chartColors as any, // Cast to any
    style: {
      ...VictoryTheme.material.legend?.style,
      labels: { 
        ...VictoryTheme.material.legend?.style?.labels, 
        fontSize: 18, // Aumentando o tamanho da fonte
        fill: 'black' // Garantindo a cor preta
      },
      title: { ...VictoryTheme.material.legend?.style?.title, fontSize: 16 },
    },
  },
  bar: {
    ...VictoryTheme.material.bar,
    barWidth: 25,
      style: { // Cast to any
      ...VictoryTheme.material.bar?.style,
      data: { fill: chartColors[0] },
      labels: { fontSize: 14, fill: 'black', fontWeight: 'bold' },
    },
  },
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVagas: 0,
    totalCandidatos: 0,
    totalCandidaturas: 0,
    totalEmpresas: 0,
  });
  const [chartData, setChartData] = useState<ChartData>({
    porEmpresa: [],
    porStatus: [],
    porSalario: [],
    topVagas: [],
    porModalidade: [],
  });
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<ChartType>('empresa');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);

        // Requisição única para o novo endpoint otimizado do backend
        const response = await fetch(`${apiUrl}/api/dashboard-stats`);
        if (!response.ok) throw new Error('Falha ao buscar dados do dashboard.');
        const { stats: fetchedStats, vagas, candidaturas } = await response.json();

        // 1. Usa as estatísticas já calculadas pelo backend
        setStats(fetchedStats);

        // 2. Processa os dados brutos para os gráficos no frontend
        const porEmpresa = processVagasPorEmpresa(vagas);
        const porStatus = processCandidaturasPorStatus(candidaturas);
        const porSalario = processVagasPorSalario(vagas);
        const topVagasData = processTopVagas(candidaturas, vagas);
        const porModalidade = processVagasPorModalidade(vagas);
        const timelineItems = processTimeline(vagas, candidaturas);

        setTimelineItems(timelineItems);
        setChartData({ porEmpresa, porStatus, porSalario, topVagas: topVagasData, porModalidade });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        setError("Falha ao carregar dados do dashboard.");
      } finally {
        setLoading(false);
      }
    }

    // A rota já é protegida, então não precisamos verificar o tipo de usuário aqui.
    fetchStats();
  }, []);

  const currentChart = useMemo(() => {
    switch (activeChart) {
      case 'empresa':
        return {
          data: chartData.porEmpresa,
          title: 'Vagas por Empresa',
          colorScale: 'qualitative',
        };
      case 'status':
        return {
          data: chartData.porStatus,
          title: 'Candidaturas por Status',
          colorScale: ['gold', 'tomato', 'green', 'blue'],
        };
      case 'salario':
        return {
          data: chartData.porSalario,
          title: 'Vagas por Faixa Salarial',
          colorScale: ['cyan', 'magenta', 'purple', 'teal'],
        };
      case 'topVagas':
        return {
          data: chartData.topVagas,
          title: 'Top 5 Vagas com Mais Candidaturas',
          colorScale: 'blue',
        };
      case 'modalidade':
        return {
          data: chartData.porModalidade,
          title: 'Vagas por Modalidade',
          colorScale: 'qualitative',
        };
      default:
        return { data: [], title: '', colorScale: 'grayscale' };
    }
  }, [activeChart, chartData]);

  if (loading || error) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center">
        {loading && <p>Carregando dashboard...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard Administrativo</h1>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Timeline items={timelineItems} />
        <ChartsDisplay
          activeChart={activeChart}
          setActiveChart={setActiveChart}
          chartData={currentChart}
        />
      </div>
    </div>
  );
}

// --- Subcomponentes ---

const StatsCards: FC<{ stats: { totalVagas: number; totalCandidatos: number; totalCandidaturas: number; totalEmpresas: number; } }> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <StatCard icon={Briefcase} value={stats.totalVagas} label="Vagas Ativas" color="text-blue-600" />
    <StatCard icon={Users} value={stats.totalCandidatos} label="Candidatos" color="text-green-600" />
    <StatCard icon={ClipboardList} value={stats.totalCandidaturas} label="Candidaturas" color="text-orange-600" />
    <StatCard icon={Building2} value={stats.totalEmpresas} label="Empresas" color="text-purple-600" />
  </div>
);

const StatCard: FC<{ icon: React.ElementType, value: number, label: string, color: string }> = ({ icon: Icon, value, label, color }) => (
  <div className="card flex items-center p-4 gap-4">
    <Icon className={`${color} h-10 w-10`} />
    <div className="text-left">
      <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
      <p className="text-gray-600">{label}</p>
    </div>
  </div>
);

const Timeline: FC<{ items: TimelineItem[] }> = ({ items }) => (
  <div className="card">
    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
      <Clock size={24} /> Linha do Tempo de Atividades
    </h2>
    <div className="space-y-6 border-l-2 border-gray-200 pl-6">
      {items.map((item) => (
        <div key={item.id} className="relative">
          <div className={`absolute -left-[33px] top-1 h-4 w-4 rounded-full ${item.type === 'vaga' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
          <p className="text-sm text-gray-500">{formatTimelineDate(item.date)}</p>
          <p className="font-medium text-gray-800 flex items-center gap-2">
            <item.Icon size={16} className={item.type === 'vaga' ? 'text-blue-600' : 'text-green-600'} />
            {item.text}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const ChartsDisplay: FC<{ activeChart: ChartType; setActiveChart: (chart: ChartType) => void; chartData: any; }> = ({ activeChart, setActiveChart, chartData }) => (
  <div className="card">
    <h2 className="text-xl font-bold mb-4">Análise Gráfica</h2>
    <div className="mb-4 flex flex-wrap gap-2">
      <ChartButton icon={PieChart} label="Vagas por Empresa" chartType="empresa" activeChart={activeChart} onClick={setActiveChart} />
      <ChartButton icon={FileText} label="Candidaturas por Status" chartType="status" activeChart={activeChart} onClick={setActiveChart} />
      <ChartButton icon={Wallet} label="Vagas por Salário" chartType="salario" activeChart={activeChart} onClick={setActiveChart} />
      <ChartButton icon={BarChart3} label="Top 5 Vagas" chartType="topVagas" activeChart={activeChart} onClick={setActiveChart} />
      <ChartButton icon={PieChart} label="Vagas por Modalidade" chartType="modalidade" activeChart={activeChart} onClick={setActiveChart} />
    </div>

    {chartData.data.length > 0 ? (
      activeChart === 'topVagas' ? (
        <div>
          <h3 className="text-lg font-semibold mb-2 text-center">{chartData.title}</h3>
          <VictoryChart 
            domainPadding={{ x: 30 }} 
            height={400} 
            width={500}
            theme={customTheme as any}
            padding={{ top: 50, bottom: 150, left: 50, right: 50 }}
          >
            <VictoryAxis 
              tickLabelComponent={
                <VictoryLabel 
                  style={{ fontSize: 12 }} 
                />} 
            />
            <VictoryAxis dependentAxis tickFormat={(x) => (`${x}`)} />
            <VictoryBar
              cornerRadius={{ top: 4 }}
              data={chartData.data}
              x="x"
              y="y"
              labels={({ datum }) => datum.y}
              labelComponent={<VictoryLabel dy={-15} />}
            />
          </VictoryChart>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">{chartData.title}</h3>
          <VictoryPie 
            data={chartData.data} 
            innerRadius={80}
            theme={customTheme as any}
            // Mostra o valor apenas se a fatia for maior que 5% do total
            labels={({ datum, data }) => {
                const total: number = (data as PieChartData[]).reduce((acc: number, d: PieChartData) => acc + d.y, 0);
              return (datum.y / total) > 0.05 ? datum.y : '';
            }} 
          />
          <VictoryLegend 
            data={chartData.data.map((d: PieChartData) => ({ name: d.name }))}
            theme={customTheme as any}
          />
        </div>
      )
    ) : (
      <p>Não há dados para exibir neste gráfico.</p>
    )}
  </div>
);

const ChartButton: FC<{ icon: React.ElementType, label: string, chartType: ChartType, activeChart: ChartType, onClick: (chart: ChartType) => void }> = ({ icon: Icon, label, chartType, activeChart, onClick }) => (
  <button onClick={() => onClick(chartType)} className={`btn ${activeChart === chartType ? 'btn-primary' : 'btn-secondary'}`}>
    <Icon size={16} /> {label}
  </button>
);