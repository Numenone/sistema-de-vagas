import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const apiUrl = import.meta.env.VITE_API_URL;

// Schema de validação com Zod para garantir que as senhas coincidam
const schema = z.object({
  novaSenha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
  confirmarSenha: z.string()
}).refine(data => data.novaSenha === data.confirmarSenha, {
  message: "As senhas não coincidem.",
  path: ["confirmarSenha"], // Aponta o erro para o campo de confirmação
});

type FormData = z.infer<typeof schema>;

export default function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!token) {
      toast.error('Token de redefinição de senha inválido ou ausente.');
      navigate('/login');
    }
  }, [token, navigate]);

  async function onSubmit(data: FormData) {
    try {
      const response = await fetch(`${apiUrl}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, novaSenha: data.novaSenha }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao redefinir a senha.');
      }

      toast.success('Senha redefinida com sucesso! Você já pode fazer login.');
      navigate('/login');

    } catch (error: any) {
      toast.error(error.message || 'Ocorreu um erro. Tente novamente.');
    }
  }

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="p-6 space-y-4">
          <h1 className="text-xl font-bold">Crie uma Nova Senha</h1>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="novaSenha" className="block mb-2 text-sm font-medium">Nova Senha</label>
              <input type="password" id="novaSenha" className="form-input" required {...register("novaSenha")} />
              {errors.novaSenha && <p className="text-red-500 text-sm mt-1">{errors.novaSenha.message}</p>}
            </div>
            <div>
              <label htmlFor="confirmarSenha" className="block mb-2 text-sm font-medium">Confirme a Nova Senha</label>
              <input type="password" id="confirmarSenha" className="form-input" required {...register("confirmarSenha")} />
              {errors.confirmarSenha && <p className="text-red-500 text-sm mt-1">{errors.confirmarSenha.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full btn-primary disabled:opacity-50">
              {isSubmitting ? 'Salvando...' : 'Redefinir Senha'}
            </button>
            <p className="text-sm text-center">
              <Link to="/login" className="font-medium text-blue-600 hover:underline">Voltar para o Login</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

