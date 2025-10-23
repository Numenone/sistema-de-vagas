import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useUsuarioStore } from './context/UsuarioContext.js';
import type { VagaType } from './utils/VagaType.js';
import { VagaForm } from './component/VagaForm.js';

type Inputs = {
  titulo: string;
  descricao: string;
  requisitos: string;
  salario: number;
  modalidade: string;
  tipoContrato: string;
};

const apiUrl = import.meta.env.VITE_API_URL;

export default function EditarVagaAdmin() {
  const { vagaId } = useParams();
  const { fetchAutenticado } = useUsuarioStore();
  const navigate = useNavigate();
  const [vaga, setVaga] = useState<VagaType | null>(null);
  const [loading, setLoading] = useState(true);

  const methods = useForm<Inputs>();

  useEffect(() => {
    async function fetchVaga() {
      try {
        // CORREÇÃO: Usar fetchAutenticado para consistência e caso a rota seja protegida.
        const response = await fetchAutenticado(`${apiUrl}/api/vagas/${vagaId}`);
        if (!response.ok) throw new Error('Vaga não encontrada.');
        const data = await response.json();

        // CORREÇÃO: Trata o caso da API retornar { vaga: ... } ou o objeto da vaga diretamente.
        const vagaData = data.vaga || data;

        setVaga(vagaData);
        methods.reset(vagaData); // Popula o formulário com os dados da vaga
      } catch (error) {
        toast.error('Erro ao carregar dados da vaga.');
        navigate('/admin/vagas');
      } finally {
        setLoading(false);
      }
    }
    fetchVaga();
  }, [vagaId, navigate, methods.reset]);

  async function onSubmit(data: Inputs) {
    try {
      const response = await fetchAutenticado(`${apiUrl}/api/vagas/${vagaId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Vaga atualizada com sucesso!');
        navigate('/admin/vagas');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao atualizar vaga.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar alterações.');
    }
  }

  if (loading) return <div className="p-6">Carregando...</div>;
  if (!vaga) return null;

  return (
    <section className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Editar Vaga: {vaga.titulo}</h1>
      <FormProvider {...methods}>
        <div className="card">
          <form className="space-y-6" onSubmit={methods.handleSubmit(onSubmit)}>
            <VagaForm isSubmitting={methods.formState.isSubmitting} />
            <div className="flex gap-4 pt-4 border-t">
              <button type="submit" className="btn-primary" disabled={methods.formState.isSubmitting}>
                {methods.formState.isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary" disabled={methods.formState.isSubmitting}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </FormProvider>
    </section>
  );
}