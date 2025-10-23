import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

type Inputs = {
  email: string;
};

const apiUrl = import.meta.env.VITE_API_URL;

export default function EsqueciSenha() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Inputs>();

  async function onSubmit(data: Inputs) {
    try {
      const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Se um usuário com este e-mail existir, um link de redefinição foi enviado.');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Ocorreu um erro.');
      }
    } catch (error) {
      toast.error('Erro de conexão. Tente novamente.');
    }
  }

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="p-6 space-y-4">
          <h1 className="text-xl font-bold">Redefinir Senha</h1>
          <p className="text-sm text-gray-600">
            Digite seu e-mail e enviaremos um link para você redefinir sua senha.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">Seu e-mail</label>
              <input type="email" id="email" className="form-input" required {...register("email")} />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full btn-primary disabled:opacity-50">
              {isSubmitting ? 'Enviando...' : 'Enviar Link de Redefinição'}
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