import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { VagaType } from '../utils/VagaType';
import type { EmpresaType } from '../utils/EmpresaType';

const apiUrl = import.meta.env.VITE_API_URL;

type Inputs = {
  titulo: string;
  descricao: string;
  requisitos: string;
  salario: number;
  empresaId: number;
};

export default function GerenciarVagas() {
  const [vagas, setVagas] = useState<VagaType[]>([]);
  const [empresas, setEmpresas] = useState<EmpresaType[]>([]);
  const { register, handleSubmit, reset } = useForm<Inputs>();

  useEffect(() => {
    fetchVagas();
    fetchEmpresas();
  }, []);

  const fetchVagas = async () => {
    try {
      const response = await fetch(`${apiUrl}/vagas?_expand=empresa`);
      setVagas(await response.json());
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
    }
  };

  const fetchEmpresas = async () => {
    try {
      const response = await fetch(`${apiUrl}/empresas`);
      setEmpresas(await response.json());
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    }
  };

  const onSubmit = async (data: Inputs) => {
    try {
      const response = await fetch(`${apiUrl}/vagas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          ativa: true,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      });

      if (response.ok) {
        toast.success('Vaga criada com sucesso!');
        reset();
        fetchVagas();
      }
    } catch (error) {
      toast.error('Erro ao criar vaga');
    }
  };

  const toggleVagaStatus = async (vaga: VagaType) => {
    try {
      await fetch(`${apiUrl}/vagas/${vaga.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativa: !vaga.ativa })
      });
      fetchVagas();
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
        <select {...register('empresaId')} className="form-input mb-4" required>
          <option value="">Selecione a empresa</option>
          {empresas.map(empresa => (
            <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>
          ))}
        </select>
        <button type="submit" className="btn-primary">Criar Vaga</button>
      </form>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Vagas Cadastradas</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th>Título</th>
                <th>Empresa</th>
                <th>Salário</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {vagas.map(vaga => (
                <tr key={vaga.id}>
                  <td>{vaga.titulo}</td>
                  <td>{vaga.empresa?.nome}</td>
                  <td>R$ {vaga.salario.toLocaleString('pt-BR')}</td>
                  <td>
                    <span className={`px-2 py-1 rounded ${vaga.ativa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {vaga.ativa ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => toggleVagaStatus(vaga)} className="btn-secondary">
                      {vaga.ativa ? 'Desativar' : 'Ativar'}
                    </button>
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