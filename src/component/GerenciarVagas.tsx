/// <reference types="vite/client" />

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { VagaType } from '../utils/VagaType';
import type { EmpresaType } from '../utils/EmpresaType';
import { useUsuarioStore } from '../context/UsuarioContext';
import { Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

type Inputs = {
  titulo: string;
  descricao: string;
  requisitos: string;
  salario: number;
  empresaId: number;
  modalidade: string;
  tipoContrato: string;
};

export default function GerenciarVagas() {
  const [vagas, setVagas] = useState<VagaType[]>([]);
  const [empresas, setEmpresas] = useState<EmpresaType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { register, handleSubmit, reset } = useForm<Inputs>(); // Removed fetchAutenticado from here
  const { fetchAutenticado } = useUsuarioStore(); // Correctly get fetchAutenticado from useUsuarioStore

  useEffect(() => {
    fetchVagas();
    fetchEmpresas();
  }, [searchTerm]); // Re-executa quando o termo de busca muda

  const fetchVagas = async () => {
    try {
      const params = new URLSearchParams();
      // Pede todas as vagas (ativas e inativas) para o painel de admin
      params.append('status', 'all');
      // Adiciona o termo de busca se ele existir
      if (searchTerm) {
        params.append('adminSearch', searchTerm);
      }

      const response = await fetchAutenticado(`${apiUrl}/api/vagas?${params.toString()}`);
      if (!response.ok) throw new Error('Falha ao buscar vagas.');
      const dados = await response.json();
      if (Array.isArray(dados.vagas)) {
        setVagas(dados.vagas);
      }
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
      toast.error('Erro ao carregar vagas.');
    }
  };

  const fetchEmpresas = async () => {
    try {
      // Usa o novo endpoint para buscar empresas
      const response = await fetchAutenticado(`${apiUrl}/api/empresas`);
      if (!response.ok) throw new Error('Falha ao buscar empresas.');
      const dados = await response.json();
      if (Array.isArray(dados)) {
        setEmpresas(dados);
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    }
  };

  const onSubmit = async (data: Inputs) => {
    try {
      // Usa o novo endpoint para criar vagas
      const response = await fetchAutenticado(`${apiUrl}/api/vagas`, {
        method: 'POST',
        body: JSON.stringify(data) // O backend agora cuida da lógica
      });

      if (response.ok) {
        toast.success('Vaga criada com sucesso!');
        reset();
        fetchVagas();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erro ao criar vaga');
      }
    } catch (error) {
      toast.error('Erro ao criar vaga');
    }
  };

  const toggleVagaStatus = async (vaga: VagaType) => {
    try {
      // Usa o novo endpoint para atualizar vagas
      const response = await fetchAutenticado(`${apiUrl}/api/vagas/${vaga.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ ativa: !vaga.ativa })
      });
      if (response.ok) {
        fetchVagas();
        toast.success(`Vaga ${!vaga.ativa ? 'ativada' : 'desativada'} com sucesso!`);
      } else {
        throw new Error('Falha ao alterar status.');
      }
    } catch (error) {
      console.error('Erro ao alterar status da vaga:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Vagas</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="card mb-8">
        <h2 className="text-xl font-bold mb-4">Nova Vaga</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input {...register('titulo')} placeholder="Título" className="form-input" required />
          <input {...register('salario')} type="number" placeholder="Salário" className="form-input" required />
        </div>
        <textarea {...register('descricao')} placeholder="Descrição" className="form-input mb-4" rows={3} required />
        <textarea {...register('requisitos')} placeholder="Requisitos" className="form-input mb-4" rows={2} required />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select {...register('modalidade')} className="form-input" required>
            <option value="">Selecione a modalidade</option>
            <option value="Remoto">Remoto</option>
            <option value="Híbrido">Híbrido</option>
            <option value="Presencial">Presencial</option>
          </select>
          <select {...register('tipoContrato')} className="form-input" required>
            <option value="">Selecione o tipo de contrato</option>
            <option value="CLT">CLT</option>
            <option value="PJ">PJ</option>
          </select>
        </div>
        <select {...register('empresaId')} className="form-input mb-4" required>
          <option value="">Selecione a empresa</option>
          {empresas.map(empresa => (
            <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>
          ))}
        </select>
        <button type="submit" className="btn-primary">Criar Vaga</button>
      </form>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Buscar Vagas</h2>
        <input
          type="text"
          placeholder="Buscar por título ou nome da empresa..."
          className="form-input w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Vagas Cadastradas</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vagas.map(vaga => (
                <tr key={vaga.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vaga.titulo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vaga.empresa?.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {vaga.salario.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vaga.ativa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {vaga.ativa ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button onClick={() => toggleVagaStatus(vaga)} className="btn-secondary">
                        {vaga.ativa ? 'Desativar' : 'Ativar'}
                      </button>
                      <Link to={`/admin/vagas/${vaga.id}/editar`} className="btn-primary">Editar</Link>
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