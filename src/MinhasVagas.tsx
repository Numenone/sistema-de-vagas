import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { VagaType } from './utils/VagaType';
import { useUsuarioStore } from './context/UsuarioContext';
import { useNavigate } from 'react-router-dom';

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
  const { register, handleSubmit, reset } = useForm<Inputs>();
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
        reset();
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

      <form onSubmit={handleSubmit(onSubmit)} className="card mb-8">
        <h2 className="text-xl font-bold mb-4">Criar Nova Vaga</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input {...register('titulo')} placeholder="Título da Vaga" className="form-input" required />
          <input {...register('salario')} type="number" placeholder="Salário" className="form-input" required />
        </div>
        <textarea {...register('descricao')} placeholder="Descrição da Vaga" className="form-input mb-4" rows={3} required />
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
        <button type="submit" className="btn-primary">Criar Vaga</button>
      </form>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Minhas Vagas Cadastradas</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* ... cabeçalho da tabela ... */}
            <tbody>
              {vagas.map(vaga => (
                <tr key={vaga.id}>
                  <td>{vaga.titulo}</td>
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