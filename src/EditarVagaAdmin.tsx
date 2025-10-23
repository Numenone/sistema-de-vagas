import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useUsuarioStore } from './context/UsuarioContext';
import type { VagaType } from './utils/VagaType';

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

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Inputs>();

  useEffect(() => {
    async function fetchVaga() {
      try {
        const response = await fetch(`${apiUrl}/api/vagas/${vagaId}`);
        if (!response.ok) throw new Error('Vaga não encontrada.');
        const { vaga: data } = await response.json();
        setVaga(data);
        reset(data); // Popula o formulário com os dados da vaga
      } catch (error) {
        toast.error('Erro ao carregar dados da vaga.');
        navigate('/admin/vagas');
      } finally {
        setLoading(false);
      }
    }
    fetchVaga();
  }, [vagaId, navigate, reset]);

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
      <div className="card">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="titulo" className="block mb-2 text-sm font-medium">Título da Vaga</label>
              <input type="text" id="titulo" className="form-input" required {...register("titulo")} />
            </div>
            <div>
              <label htmlFor="salario" className="block mb-2 text-sm font-medium">Salário</label>
              <input type="number" id="salario" className="form-input" required {...register("salario")} />
            </div>
          </div>
          <div>
            <label htmlFor="descricao" className="block mb-2 text-sm font-medium">Descrição</label>
            <textarea id="descricao" className="form-input" rows={4} required {...register("descricao")} />
          </div>
          <div>
            <label htmlFor="requisitos" className="block mb-2 text-sm font-medium">Requisitos</label>
            <textarea id="requisitos" className="form-input" rows={3} required {...register("requisitos")} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="modalidade" className="block mb-2 text-sm font-medium">Modalidade</label>
              <select id="modalidade" {...register('modalidade')} className="form-input" required>
                <option value="Remoto">Remoto</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Presencial">Presencial</option>
              </select>
            </div>
            <div>
              <label htmlFor="tipoContrato" className="block mb-2 text-sm font-medium">Tipo de Contrato</label>
              <select id="tipoContrato" {...register('tipoContrato')} className="form-input" required>
                <option value="CLT">CLT</option>
                <option value="PJ">PJ</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary" disabled={isSubmitting}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}