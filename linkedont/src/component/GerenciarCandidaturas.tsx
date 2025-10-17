import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { CandidaturaType } from '../utils/CandidaturaType';

const apiUrl = import.meta.env.VITE_API_URL;

export default function GerenciarCandidaturas() {
  const [candidaturas, setCandidaturas] = useState<CandidaturaType[]>([]);

  useEffect(() => {
    fetchCandidaturas();
  }, []);

  const fetchCandidaturas = async () => {
    try {
      const response = await fetch(`${apiUrl}/candidaturas?_expand=vaga&_expand=usuario&_expand=empresa`);
      setCandidaturas(await response.json());
    } catch (error) {
      console.error('Erro ao buscar candidaturas:', error);
    }
  };

  const atualizarStatus = async (candidaturaId: number, novoStatus: string) => {
    try {
      await fetch(`${apiUrl}/candidaturas/${candidaturaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: novoStatus,
          updatedAt: new Date().toISOString()
        })
      });
      toast.success('Status atualizado!');
      fetchCandidaturas();
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Candidaturas</h1>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th>Vaga</th>
                <th>Candidato</th>
                <th>Mensagem</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {candidaturas.map(candidatura => (
                <tr key={candidatura.id}>
                  <td>
                    <div className="font-bold">{candidatura.vaga.titulo}</div>
                    <div className="text-sm text-gray-600">{candidatura.vaga.empresa.nome}</div>
                  </td>
                  <td>
                    <div>{candidatura.usuario.nome}</div>
                    <div className="text-sm text-gray-600">{candidatura.usuario.email}</div>
                  </td>
                  <td className="max-w-xs">{candidatura.descricao}</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs ${
                      candidatura.status === 'aprovada' ? 'bg-green-100 text-green-800' :
                      candidatura.status === 'rejeitada' ? 'bg-red-100 text-red-800' :
                      candidatura.status === 'visualizada' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {candidatura.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => atualizarStatus(candidatura.id, 'aprovada')} className="btn-primary text-xs">
                        Aprovar
                      </button>
                      <button onClick={() => atualizarStatus(candidatura.id, 'rejeitada')} className="btn-secondary text-xs">
                        Rejeitar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}