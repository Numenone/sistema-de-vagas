import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUsuarioStore } from './context/UsuarioContext.js';
import type { EmpresaType } from './utils/EmpresaType.js';

type Inputs = {
  nome: string;
  descricao: string;
  logo?: FileList;
};

const apiUrl = import.meta.env.VITE_API_URL;

export default function EditarEmpresa() {
  const { usuario, fetchAutenticado, atualizaToken } = useUsuarioStore();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState<EmpresaType | null>(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, watch, reset, formState: { isSubmitting } } = useForm<Inputs>();
  const logoAssistida = watch('logo');

  const fetchMinhaEmpresa = useCallback(async () => {
    try {
      const response = await fetchAutenticado(`${apiUrl}/api/empresa/me`);
      if (response.status === 404) {
        setEmpresa(null); // Nenhuma empresa encontrada, modo de criação
        return;
      }
      if (!response.ok) {
        throw new Error('Falha ao buscar dados da empresa.');
      }
      const data = await response.json();
      setEmpresa(data);
      reset({ nome: data.nome, descricao: data.descricao }); // Popula o formulário
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar dados da empresa.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [fetchAutenticado, navigate, reset]);

  useEffect(() => {
    // Garante que apenas líderes acessem esta página
    if (usuario.tipo !== 'lider') {
      toast.error('Acesso não autorizado.');
      navigate('/');
      return;
    }
    fetchMinhaEmpresa();
  }, [usuario, navigate, fetchMinhaEmpresa]);

  async function onSubmit(data: Inputs) {
    const formData = new FormData();
    formData.append('nome', data.nome);
    formData.append('descricao', data.descricao);
    if (data.logo && data.logo.length > 0) {
      formData.append('logo', data.logo[0]);
    }

    const isCreating = !empresa;
    const url = isCreating ? `${apiUrl}/api/empresa` : `${apiUrl}/api/empresa`;
    const method = isCreating ? 'POST' : 'PATCH';

    try {
      const response = await fetchAutenticado(url, {
        method,
        body: formData,
      });

      const responseData = await response.json();
      if (response.ok) {
        toast.success(`Empresa ${isCreating ? 'criada' : 'atualizada'} com sucesso!`);
        if (isCreating && responseData.token) {
          // Se estiver criando, atualiza o token no estado global
          atualizaToken(responseData.token);
        }
        // Redireciona para o perfil da empresa recém-criada/editada
        navigate(`/empresas/${responseData.empresa.id}`);
      } else {
        throw new Error(responseData.error || `Falha ao ${isCreating ? 'criar' : 'atualizar'} empresa.`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar alterações.');
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Carregando...</div>;
  }

  return (
    <section className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        {empresa ? `Editar Empresa: ${empresa.nome}` : 'Criar Perfil da Empresa'}
      </h1>
      <div className="card">
        <p className="text-sm text-gray-600 mb-6">
          {empresa
            ? 'Atualize as informações da sua empresa.'
            : 'Preencha os dados abaixo para criar o perfil da sua empresa e começar a postar vagas.'}
        </p>
        <div className="flex items-center gap-4 mb-6">
          <img
            src={
              logoAssistida && logoAssistida.length > 0
                ? URL.createObjectURL(logoAssistida[0])
                : empresa?.logo || "https://via.placeholder.com/100x100?text=Logo"
            }
            alt="Logo da empresa"
            className="w-24 h-24 rounded-lg object-contain border p-1 bg-gray-50"
          />
          <div>
            <label htmlFor="logo" className="btn-secondary cursor-pointer">
              {empresa?.logo ? 'Trocar Logo' : 'Upload Logo'}
            </label>
            <input type="file" id="logo" className="hidden" {...register("logo")} accept="image/*" />
          </div>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="nome" className="block mb-2 text-sm font-medium">Nome da Empresa</label>
            <input type="text" id="nome" className="form-input" required {...register("nome")} />
          </div>
          <div>
            <label htmlFor="descricao" className="block mb-2 text-sm font-medium">Descrição</label>
            <textarea id="descricao" className="form-input" rows={5} required {...register("descricao")} />
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