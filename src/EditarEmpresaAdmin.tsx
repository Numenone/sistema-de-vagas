import React, { useEffect, useState, useCallback } from 'react';
import { useForm, useForm as useFormAssociar } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useUsuarioStore } from './context/UsuarioContext';
import type { EmpresaType } from './utils/EmpresaType';

import type { UsuarioType } from './utils/UsuarioType';
// Tipos para o formulário principal de edição da empresa
type Inputs = {
  nome: string;
  descricao: string;
  logo?: FileList;
};

const apiUrl = import.meta.env.VITE_API_URL;

// Tipos para o novo formulário de associação de líder
type AssociarLiderInputs = {
  email: string;
};

export default function EditarEmpresaAdmin() {
  const { id: empresaId } = useParams();
  const { fetchAutenticado } = useUsuarioStore();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState<EmpresaType | null>(null);
  const [loading, setLoading] = useState(true);
  const [lideres, setLideres] = useState<UsuarioType[]>([]);

  const { register, handleSubmit, watch, reset } = useForm<Inputs>();
  const logoAssistida = watch('logo');

  // Instância separada do react-hook-form para o formulário de associação
  const { register: registerAssociar, handleSubmit: handleSubmitAssociar, reset: resetAssociar } = useFormAssociar<AssociarLiderInputs>();

  const fetchLideres = useCallback(async () => {
    try {
      const response = await fetchAutenticado(`${apiUrl}/api/empresa/lideres`);
      if (!response.ok) {
        throw new Error('Falha ao buscar líderes.');
      }
      const data = await response.json();
      setLideres(data);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar líderes.');
    }
  }, [fetchAutenticado]);

  useEffect(() => {
    async function fetchEmpresa() {
      try {
        const response = await fetch(`${apiUrl}/api/empresas/${empresaId}`);
        if (!response.ok) throw new Error('Empresa não encontrada.');
        const data = await response.json();
        setEmpresa(data);
        reset({ nome: data.nome, descricao: data.descricao }); // Popula o formulário
      } catch (error) {
        toast.error('Erro ao carregar dados da empresa.');
        navigate('/admin/dashboard');
      } finally {
        setLoading(false);
      }
    }

    fetchEmpresa();
    fetchLideres();
  }, [empresaId, navigate, reset, fetchAutenticado, fetchLideres]);

  async function onSubmit(data: Inputs) {
    const formData = new FormData();
    formData.append('nome', data.nome);
    formData.append('descricao', data.descricao);
    if (data.logo && data.logo.length > 0) {
      formData.append('logo', data.logo[0]);
    }

    try {
      const response = await fetchAutenticado(`${apiUrl}/api/admin/empresas/${empresaId}`, {
        method: 'PATCH',
        body: formData,
      });

      if (response.ok) {
        toast.success('Empresa atualizada com sucesso!');
        navigate(`/empresas/${empresaId}`); // Redireciona para o perfil da empresa
      } else {
        throw new Error('Falha ao atualizar empresa.');
      }
    } catch (error) {
      toast.error('Erro ao salvar alterações.');
    }
  }

  async function onAssociarLider(data: AssociarLiderInputs) {
    if (!confirm(`Deseja promover o usuário com o e-mail "${data.email}" a líder desta empresa?`)) {
      return;
    }

    try {
      const response = await fetchAutenticado(`${apiUrl}/api/empresa/associar-lider`, {
        method: 'POST',
        body: JSON.stringify({ email: data.email }),
      });

      const responseData = await response.json();
      if (response.ok) {
        toast.success(responseData.message);
        resetAssociar(); // Limpa o campo de e-mail
        // Atualiza a lista de líderes para refletir a nova adição
        fetchLideres();
      } else {
        throw new Error(responseData.error || 'Falha ao associar líder.');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  if (loading) return <div className="p-6">Carregando...</div>;
  if (!empresa) return null;

  return (
    <section className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Editar Empresa: {empresa.nome}</h1>
      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={
              logoAssistida && logoAssistida.length > 0
                ? URL.createObjectURL(logoAssistida[0])
                : empresa.logo || ''
            }
            alt="Logo da empresa"
            className="w-24 h-24 rounded-lg object-contain border p-1"
          />
          <div>
            <label htmlFor="logo" className="btn-secondary cursor-pointer">Trocar Logo</label>
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
            <button type="submit" className="btn-primary">
              Salvar Alterações
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {/* Seção para listar líderes atuais */}
      <div className="card mt-8">
        <h2 className="text-xl font-bold mb-4">Líderes Atuais ({lideres.length})</h2>
        <div className="space-y-4">
          {lideres.map(lider => (
            <div key={lider.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <img
                  src={lider.fotoPerfil || `https://ui-avatars.com/api/?name=${lider.nome}&background=random`}
                  alt={`Foto de ${lider.nome}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{lider.nome}</p>
                  <p className="text-sm text-gray-500">{lider.email}</p>
                </div>
              </div>
              {/* Espaço para futuro botão de "Remover" */}
            </div>
          ))}
        </div>
      </div>

      {/* Seção para associar novo líder */}
      <div className="card mt-8">
        <h2 className="text-xl font-bold mb-4">Associar Novo Líder</h2>
        <p className="text-sm text-gray-600 mb-4">
          Digite o e-mail de um usuário já cadastrado como &quot;candidato&quot; para promovê-lo a líder da sua empresa.
        </p>
        <form className="flex items-center gap-4" onSubmit={handleSubmitAssociar(onAssociarLider)}>
          <input
            type="email"
            placeholder="email.do.candidato@exemplo.com"
            className="form-input flex-1"
            required
            {...registerAssociar("email")}
          />
          <button type="submit" className="btn-success">Associar Líder</button>
        </form>
      </div>
    </section>
  );
}