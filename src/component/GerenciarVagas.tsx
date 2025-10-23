import { useEffect, useState, useMemo, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'sonner';
import type { VagaType } from '../utils/VagaType.js';
import type { EmpresaType } from '../utils/EmpresaType.js';
import { useUsuarioStore } from '../context/UsuarioContext.js';
import { Link } from 'react-router-dom';
import { VagaForm } from './VagaForm.js';

// Função de debounce para evitar múltiplas requisições à API
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => func(...args), waitFor);
  };
}

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
  const [vagaParaConfirmar, setVagaParaConfirmar] = useState<VagaType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const methods = useForm<Inputs>();
  const { fetchAutenticado } = useUsuarioStore(); // Correctly get fetchAutenticado from useUsuarioStore

  // A função de busca de vagas agora é envolvida por useCallback.
  const fetchVagas = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      // Pede todas as vagas (ativas e inativas) para o painel de admin
      params.append('status', 'all');
      // Adiciona o termo de busca se ele existir, ou 'true' para indicar uma busca de admin
      params.append('adminSearch', searchTerm || 'true');
      params.append('_expand', 'empresa');


      const response = await fetchAutenticado(`${apiUrl}/api/vagas?${params.toString()}`);
      if (!response.ok) throw new Error('Falha ao buscar vagas.');
      const dados = await response.json();
      if (dados.vagas) {
        setVagas(dados.vagas);
      }
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
      toast.error('Erro ao carregar vagas.');
    }
  }, [searchTerm, fetchAutenticado]);

  // O debounce é criado a partir da função `fetchVagas` já declarada.
  const debouncedFetch = useMemo(() => debounce(fetchVagas, 500), [fetchVagas]);

  useEffect(() => {
    debouncedFetch();
    fetchEmpresas();
  }, [debouncedFetch]); // A dependência agora é apenas o debouncedFetch

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
        methods.reset();
        fetchVagas();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erro ao criar vaga');
      }
    } catch (error) {
      toast.error('Erro ao criar vaga');
    }
  };

  const handleToggleVagaStatus = async () => {
    if (!vagaParaConfirmar) return;

    try {
      // Usa o novo endpoint para atualizar vagas
      const response = await fetchAutenticado(`${apiUrl}/api/vagas/${vagaParaConfirmar.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ ativa: !vagaParaConfirmar.ativa })
      });
      if (response.ok) {
        fetchVagas();
        toast.success(`Vaga ${!vagaParaConfirmar.ativa ? 'ativada' : 'desativada'} com sucesso!`);
      } else {
        throw new Error('Falha ao alterar status.');
      }
    } catch (error) {
      console.error('Erro ao alterar status da vaga:', error);
    } finally {
      setVagaParaConfirmar(null); // Fecha o modal
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Vagas</h1>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="card mb-8">
          <h2 className="text-xl font-bold mb-4">Nova Vaga</h2>
          <VagaForm
            isSubmitting={methods.formState.isSubmitting}
            empresas={empresas}
            isAdminForm={true}
          />
          <button type="submit" className="btn-primary mt-6" disabled={methods.formState.isSubmitting}>
            {methods.formState.isSubmitting ? 'Criando...' : 'Criar Vaga'}
          </button>
        </form>
      </FormProvider>

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
                      <button onClick={() => setVagaParaConfirmar(vaga)} className="btn-secondary">
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

      {/* Modal de Confirmação */}
      {vagaParaConfirmar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirmar Ação</h3>
            <p>
              Você tem certeza que deseja{' '}
              <span className="font-bold">{vagaParaConfirmar.ativa ? 'desativar' : 'ativar'}</span> a vaga &quot;
              <span className="font-bold">{vagaParaConfirmar.titulo}</span>&quot;?
            </p>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={() => setVagaParaConfirmar(null)} className="btn-secondary">
                Cancelar
              </button>
              <button onClick={handleToggleVagaStatus} className="btn-danger">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}