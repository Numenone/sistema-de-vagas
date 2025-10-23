import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUsuarioStore } from './context/UsuarioContext';

const apiUrl = import.meta.env.VITE_API_URL;

interface Stats {
  vagasAtivas: number;
  novasCandidaturas: number;
}

// Componente de card de estatística, agora com um estado de carregamento
const StatCard = ({ title, value, icon, loading }: { title: string; value: string | number; icon: React.ReactNode; loading?: boolean; }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
    <div className={`p-3 rounded-full ${loading ? 'bg-gray-200' : 'bg-blue-100 text-blue-600'}`}>
      {loading ? <div className="h-6 w-6"></div> : icon}
    </div>
    {loading ? (
      <div className="space-y-2 animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
        <div className="h-6 bg-gray-300 rounded w-12"></div>
      </div>
    ) : (
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">
          {value}
        </p>
      </div>
    )}
  </div>
);

export default function PerfilLider() {
  const { usuario } = useUsuarioStore();

  const [stats, setStats] = useState<Stats>({ vagasAtivas: 0, novasCandidaturas: 0 });
  const [loading, setLoading] = useState(true);
  const { fetchAutenticado } = useUsuarioStore();

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetchAutenticado(`${apiUrl}/api/empresa/me/stats`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Erro ao buscar estatísticas do líder:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [fetchAutenticado]);

  return (
    <section className="max-w-7xl mx-auto p-6">
      <div className="flex items-center gap-6 mb-8">
        <img
          src={usuario.fotoPerfil || `https://ui-avatars.com/api/?name=${usuario.nome}&background=random`}
          alt={`Foto de ${usuario.nome}`}
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
        />
        <div>
          <h1 className="text-3xl font-bold">{usuario.nome}</h1>
          <p className="text-gray-600">Painel de Controle do Líder</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Vagas Ativas" value={stats.vagasAtivas} loading={loading} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
        <StatCard title="Novas Candidaturas" value={stats.novasCandidaturas} loading={loading} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A10.004 10.004 0 002.25 10.5a4 4 0 118 0c0 .668-.113 1.31-.32 1.923" /></svg>} />
        <StatCard title="Empresa" value={usuario.empresa?.nome || 'N/A'} loading={!usuario.empresa} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Gerenciar Vagas</h2>
          <p className="text-gray-600 mb-4">Crie, edite e visualize o status de todas as vagas da sua empresa.</p>
          <Link to="/empresa/vagas" className="btn-primary w-full text-center">
            Ir para Minhas Vagas
          </Link>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Gerenciar Candidaturas</h2>
          <p className="text-gray-600 mb-4">Analise os perfis dos candidatos que se aplicaram às suas vagas.</p>
          <Link to="/empresa/candidaturas" className="btn-secondary w-full text-center">
            Ver Candidaturas
          </Link>
        </div>
      </div>
    </section>
  );
}