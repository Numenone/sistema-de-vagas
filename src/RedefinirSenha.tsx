import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { passwordValidation } from '../schemas/usuario.schema'; // Importa a validação
import { zodResolver } from '@hookform/resolvers/zod';

const apiUrl = import.meta.env.VITE_API_URL;

// Componente para o indicador de força da senha (copiado de Cadastro.tsx)
const PasswordStrengthIndicator = ({ password = "" }: { password?: string }) => {
  const checks = [
    { label: "Mínimo 8 caracteres", regex: /.{8,}/ },
    { label: "Uma letra minúscula", regex: /[a-z]/ },
    { label: "Uma letra maiúscula", regex: /[A-Z]/ },
    { label: "Um número", regex: /[0-9]/ },
    { label: "Um caractere especial", regex: /[^a-zA-Z0-9]/ },
  ];

  const strength = checks.reduce((acc, check) => acc + (check.regex.test(password) ? 1 : 0), 0);
  const strengthPercentage = (strength / checks.length) * 100;

  const getStrengthInfo = () => {
    if (strength < 3) return { text: "Fraca", color: "bg-red-500", textColor: "text-red-500" };
    if (strength < 5) return { text: "Média", color: "bg-yellow-500", textColor: "text-yellow-500" };
    return { text: "Forte", color: "bg-green-500", textColor: "text-green-500" };
  };

  const { text, color, textColor } = getStrengthInfo();

  return (
    <div className="mt-2 space-y-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-600">Força da senha:</span>
        {password.length > 0 && <span className={`text-sm font-bold ${textColor}`}>{text}</span>}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${strengthPercentage}%` }}
        ></div>
      </div>
      <ul className="text-sm text-gray-500 space-y-1 pt-1">
        {checks.map((check, index) => (
          <li key={index} className={`flex items-center transition-colors duration-300 ${check.regex.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
            <svg className="w-4 h-4 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d={check.regex.test(password) ? "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" : "M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"}
                clipRule="evenodd"
              />
            </svg>
            {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Schema de validação com Zod para garantir que as senhas coincidam
const schema = z.object({
  novaSenha: passwordValidation,
  confirmarSenha: z.string().min(1, "A confirmação de senha é obrigatória.")
}).refine(data => data.novaSenha === data.confirmarSenha, {
  message: "As senhas não coincidem.",
  path: ["confirmarSenha"], // Aponta o erro para o campo de confirmação
});

type FormData = z.infer<typeof schema>; // O tipo agora é inferido do schema

export default function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema), // Conecta o Zod ao formulário
  });
  const senhaAtual = watch('novaSenha');

  useEffect(() => {
    if (!token) {
      toast.error('Token de redefinição de senha inválido ou ausente.');
      navigate('/login');
    }
  }, [token, navigate]);

  async function onSubmit(data: FormData) {
    try {
      const response = await fetch(`${apiUrl || ''}/api/auth/reset-password`, {
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
              <PasswordStrengthIndicator password={senhaAtual} />
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