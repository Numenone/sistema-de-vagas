import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useUsuarioStore } from '../context/UsuarioContext';
import { type CandidaturaType, STATUS_CANDIDATURA, type StatusCandidatura, statusStyles } from '../utils/CandidaturaType';
import { Search, Filter } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL;

export default function GerenciarCandidaturas() {
  const [candidaturas, setCandidaturas] = useState<CandidaturaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const { fetchAutenticado } = useUsuarioStore();

  useEffect(() => {
    async function fetchCandidaturas() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (filtroStatus !== 'todas') params.append('status', filtroStatus);

        const response = await fetchAutenticado(`${apiUrl}/api/candidaturas?${params.toString()}`);
        if (!response.ok) throw new Error('Falha ao buscar candidaturas.');
        const data = await response.json();
        setCandidaturas(data);
      } catch (error) {
        toast.error('Erro ao carregar candidaturas.');
      } finally {
        setLoading(false);
      }
    }

    const handler = setTimeout(() => {
      fetchCandidaturas();
    }, 300); // Debounce para a busca

    return () => clearTimeout(handler);
  }, [fetchAutenticado, searchTerm, filtroStatus]);

  async function handleStatusChange(candidaturaId: number, newStatus: StatusCandidatura) {
    try {
      const response = await fetchAutenticado(`${apiUrl}/api/candidaturas/${candidaturaId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Falha ao atualizar status.');

      toast.success('Status da candidatura atualizado!');
      setCandidaturas(prev =>
        prev.map(cand => (cand.id === candidaturaId ? { ...cand, status: newStatus } : cand))
      );
    } catch (error) {
      toast.error('Erro ao atualizar status da candidatura.');
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Carregando candidaturas...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Candidaturas</h1>
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por candidato, vaga ou empresa..."
            className="form-input pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select
            className="form-input pl-10 w-full"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todas">Todos os Status</option>
            {STATUS_CANDIDATURA.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela de Candidaturas */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidato</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaga</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {candidaturas.map(c => (
              <tr key={c.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{c.usuario.nome}</div>
                  <div className="text-sm text-gray-500">{c.usuario.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{c.vaga.titulo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.vaga.empresa.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c.id, e.target.value as StatusCandidatura)}
                    className={`form-input py-1 text-sm border-2 ${statusStyles[c.status as StatusCandidatura]}`}
                  >
                    {STATUS_CANDIDATURA.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
)}