import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';

type Inputs = {
  senha: string;
  confirmarSenha: string;
};

const apiUrl = import.meta.env.VITE_API_URL;

export default function RedefinirSenha() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Inputs>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.error('Token de redefinição inválido ou ausente.');
      navigate('/login');
    }
  }, [token, navigate]);

  async function onSubmit(data: Inputs) {
    if (data.senha !== data.confirmarSenha) {
      toast.error('As senhas não coincidem.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, senha: data.senha }),
      });

      if (response.ok) {
        toast.success('Senha redefinida com sucesso! Você já pode fazer login.');
        navigate('/login');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Não foi possível redefinir a senha.');
      }
    } catch (error) {
      toast.error('Erro de conexão. Tente novamente.');
    }
  }

  if (!token) {
    return null; // Evita renderizar o formulário sem token
  }

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="p-6 space-y-4">
          <h1 className="text-xl font-bold">Crie uma Nova Senha</h1>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="senha" className="block mb-2 text-sm font-medium">Nova Senha</label>
              <input type="password" id="senha" className="form-input" required {...register("senha")} />
            </div>
            <div>
              <label htmlFor="confirmarSenha" className="block mb-2 text-sm font-medium">Confirmar Nova Senha</label>
              <input type="password" id="confirmarSenha" className="form-input" required {...register("confirmarSenha")} />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full btn-primary disabled:opacity-50">
              {isSubmitting ? 'Salvando...' : 'Salvar Nova Senha'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}