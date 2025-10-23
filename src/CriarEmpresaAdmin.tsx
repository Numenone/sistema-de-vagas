import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUsuarioStore } from './context/UsuarioContext';


type Inputs = {
  nome: string;
  descricao: string;
  logo?: FileList;
};

const apiUrl = import.meta.env.VITE_API_URL;

export default function CriarEmpresaAdmin() {
  const { fetchAutenticado } = useUsuarioStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
  const logoAssistida = watch('logo');

  async function onSubmit(data: Inputs) {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('nome', data.nome);
    formData.append('descricao', data.descricao);
    if (data.logo && data.logo.length > 0) {
      formData.append('logo', data.logo[0]);
    }

    try {
      const response = await fetchAutenticado(`${apiUrl}/api/admin/empresas`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const novaEmpresa = await response.json();
        toast.success('Empresa criada com sucesso!');
        navigate(`/admin/empresas/${novaEmpresa.id}/editar`); // Redireciona para a página de edição
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao criar empresa.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar empresa.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Criar Nova Empresa</h1>
      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={
              logoAssistida && logoAssistida.length > 0
                ? URL.createObjectURL(logoAssistida[0])
                : "https://via.placeholder.com/100x100?text=Logo" // Placeholder para nova empresa
            }
            alt="Logo da empresa"
            className="w-24 h-24 rounded-lg object-contain border p-1"
          />
          <div>
            <label htmlFor="logo" className="btn-secondary cursor-pointer">Upload Logo</label>
            <input type="file" id="logo" className="hidden" {...register("logo")} accept="image/*" />
            {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo.message}</p>}
          </div>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="nome" className="block mb-2 text-sm font-medium">Nome da Empresa</label>
            <input
              type="text"
              id="nome"
              className="form-input"
              required
              {...register("nome", { required: "O nome da empresa é obrigatório." })}
            />
            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
          </div>
          <div>
            <label htmlFor="descricao" className="block mb-2 text-sm font-medium">Descrição</label>
            <textarea
              id="descricao"
              className="form-input"
              rows={5}
              required
              {...register("descricao", { required: "A descrição da empresa é obrigatória." })}
            />
            {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao.message}</p>}
          </div>
          <div className="flex gap-4">
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar Empresa'}
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