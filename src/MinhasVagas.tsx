import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'sonner';
import type { VagaType } from './utils/VagaType.js';
import { useUsuarioStore } from './context/UsuarioContext.js';
import { Link, useNavigate } from 'react-router-dom';
import { VagaForm } from './component/VagaForm.js';

const apiUrl = import.meta.env.VITE_API_URL;

type Inputs = {
  titulo: string;
  descricao: string;
  requisitos: string;
  salario: number;
  modalidade: string;
  tipoContrato: string;
};

export default function MinhasVagas() {
  const [vagas, setVagas] = useState<VagaType[]>([]);
  const { usuario } = useUsuarioStore();
  const { fetchAutenticado } = useUsuarioStore();
  const methods = useForm<Inputs>();
  const navigate = useNavigate();

  const fetchVagas = async () => {
    if (!usuario?.empresaId) return;
    try {
      const response = await fetchAutenticado(`${apiUrl}/api/vagas?empresaId=${usuario.empresaId}&status=all`);
      if (!response.ok) throw new Error('Falha ao buscar vagas.');
      const dados = await response.json();
      // Ajuste para o novo formato de resposta
      setVagas(dados.vagas ?? dados ?? []);
    } catch (error) {
      toast.error('Erro ao carregar vagas.');
    }
  };

  useEffect(() => {
    if (usuario.tipo !== 'lider' || !usuario.empresaId) {
      toast.error('Acesso não autorizado.');
      navigate('/');
    } else {
      fetchVagas();
    }
  }, [usuario, navigate]);

  const onSubmit = async (data: Inputs) => {
    try {
      const response = await fetchAutenticado(`${apiUrl}/api/vagas`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Vaga criada com sucesso!');
        methods.reset();
        fetchVagas();
      } else {
        const errorData = await response.json();
        toast.error(errorData?.message || 'Erro ao criar vaga');
      }
    } catch (error) {
      toast.error('Erro ao criar vaga');
    }
  };

  const toggleVagaStatus = async (vaga: VagaType) => {
    try {
      const response = await fetchAutenticado(`${apiUrl}/api/vagas/${vaga.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ ativa: !vaga.ativa }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.message || 'Falha ao alterar status.');
      }

      // Atualiza o estado local para refletir a mudança imediatamente
      setVagas(prev => prev.map(v => (v.id === vaga.id ? { ...v, ativa: !v.ativa } : v)));
      toast.success('Status da vaga atualizado.');
    } catch (error) {
      console.error('Erro ao alterar status da vaga:', error);
      toast.error('Erro ao alterar status da vaga');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Vagas da Empresa</h1>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="card mb-8">
          <h2 className="text-xl font-bold mb-4">Criar Nova Vaga</h2>
          <VagaForm
            isSubmitting={methods.formState.isSubmitting}
          />
          <button type="submit" className="btn-primary mt-6" disabled={methods.formState.isSubmitting}>
            {methods.formState.isSubmitting ? 'Criando...' : 'Criar Vaga'}
          </button>
        </form>
      </FormProvider>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Minhas Vagas Cadastradas</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {vagas.map(vaga => (
                <tr key={vaga.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vaga.titulo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {vaga.salario.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded ${vaga.ativa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {vaga.ativa ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    <Link to={`/empresa/candidaturas?vagaId=${vaga.id}`} className="btn-primary">Ver Candidatos</Link>
                    <button onClick={() => toggleVagaStatus(vaga)} className="btn-secondary">{vaga.ativa ? 'Desativar' : 'Ativar'}</button>
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