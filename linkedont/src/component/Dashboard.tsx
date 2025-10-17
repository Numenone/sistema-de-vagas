import React, { useEffect, useState } from 'react';
import { useUsuarioStore } from '../context/UsuarioContext';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVagas: 0,
    totalCandidatos: 0,
    totalCandidaturas: 0,
    totalEmpresas: 0
  });
  const { usuario } = useUsuarioStore();

  useEffect(() => {
    async function fetchStats() {
      try {
        const [vagasRes, candidatosRes, candidaturasRes, empresasRes] = await Promise.all([
          fetch(`${apiUrl}/vagas`),
          fetch(`${apiUrl}/usuarios?tipo=candidato`),
          fetch(`${apiUrl}/candidaturas`),
          fetch(`${apiUrl}/empresas`)
        ]);

        const statsData = {
          totalVagas: (await vagasRes.json()).length,
          totalCandidatos: (await candidatosRes.json()).length,
          totalCandidaturas: (await candidaturasRes.json()).length,
          totalEmpresas: (await empresasRes.json()).length
        };

        setStats(statsData);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      }
    }

    if (usuario.tipo === 'admin') {
      fetchStats();
    }
  }, [usuario.tipo]);

  if (usuario.tipo !== 'admin') {
    return <div>Acesso restrito a administradores</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard Administrativo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <h3 className="text-2xl font-bold text-blue-600">{stats.totalVagas}</h3>
          <p className="text-gray-600">Vagas Ativas</p>
        </div>
        <div className="card text-center">
          <h3 className="text-2xl font-bold text-green-600">{stats.totalCandidatos}</h3>
          <p className="text-gray-600">Candidatos</p>
        </div>
        <div className="card text-center">
          <h3 className="text-2xl font-bold text-orange-600">{stats.totalCandidaturas}</h3>
          <p className="text-gray-600">Candidaturas</p>
        </div>
        <div className="card text-center">
          <h3 className="text-2xl font-bold text-purple-600">{stats.totalEmpresas}</h3>
          <p className="text-gray-600">Empresas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Últimas Candidaturas</h3>
        </div>
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Vagas Recentes</h3>
        </div>
      </div>
    </div>
  );
}