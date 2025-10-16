import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUsuarioStore } from './context/UsuarioContext';

type Inputs = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};

const apiUrl = import.meta.env.VITE_API_URL;

export default function Cadastro() {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const { logaUsuario } = useUsuarioStore();
  const navigate = useNavigate();

  async function onSubmit(data: Inputs) {
    if (data.senha !== data.confirmarSenha) {
      toast.error('As senhas não coincidem.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: data.nome,
          email: data.email,
          senha: data.senha,
          tipo: 'candidato', // Novos usuários são sempre candidatos por padrão
        }),
      });

      if (response.status === 201) {
        const novoUsuario = await response.json();
        toast.success('Cadastro realizado com sucesso! Você será redirecionado.');
        // Loga o usuário e o redireciona
        logaUsuario(novoUsuario, true);
        setTimeout(() => navigate('/'), 2000);
      } else {
        const errorData = await response.json();
        // Verifica se o erro é de email duplicado
        if (errorData.error?.toLowerCase().includes('unique constraint failed')) {
          toast.error('Este e-mail já está em uso.');
        } else {
          toast.error('Erro ao realizar o cadastro. Tente novamente.');
        }
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast.error("Erro de conexão. Tente novamente mais tarde.");
    }
  }

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="p-6 space-y-4">
          <h1 className="text-xl font-bold">Crie sua Conta</h1>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="nome" className="block mb-2 text-sm font-medium">Seu nome</label>
              <input type="text" id="nome" className="form-input" required {...register("nome")} />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">Seu e-mail</label>
              <input type="email" id="email" className="form-input" required {...register("email")} />
            </div>
            <div>
              <label htmlFor="senha" className="block mb-2 text-sm font-medium">Senha</label>
              <input type="password" id="senha" className="form-input" required {...register("senha")} />
            </div>
            <div>
              <label htmlFor="confirmarSenha" className="block mb-2 text-sm font-medium">Confirmar Senha</label>
              <input type="password" id="confirmarSenha" className="form-input" required {...register("confirmarSenha")} />
            </div>
            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Cadastrar
            </button>
            <p className="text-sm font-light text-gray-500">
              Já possui uma conta? <a href="/login" className="font-medium text-blue-600 hover:underline">Faça login</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}