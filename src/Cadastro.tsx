import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUsuarioStore } from './context/UsuarioContext';
import { passwordValidation } from '../schemas/usuario.schema';

// Schema de validação com Zod
const schema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório.'),
  email: z.string().email('Formato de e-mail inválido.'),
  senha: passwordValidation,
  // A mensagem de erro para campos obrigatórios deve ser definida no nível do objeto.
  tipo: z.string({ required_error: 'Por favor, selecione o tipo de conta.' }).pipe(z.enum(['candidato', 'lider'])),
  confirmarSenha: z.string(),
}).refine(data => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem.",
  path: ["confirmarSenha"], // Aponta o erro para o campo de confirmação
});

type FormData = z.infer<typeof schema>;

const apiUrl = import.meta.env.VITE_API_URL;

// Componente para o indicador de força da senha
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

export default function Cadastro() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { logaUsuario } = useUsuarioStore();
  const navigate = useNavigate();
  const senhaAtual = watch('senha');
  async function onSubmit(data: FormData) {
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
          tipo: data.tipo,
        }),
      });

      if (response.status === 201) {
        const loginResponse = await fetch(`${apiUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, senha: data.senha }),
        });

        if (loginResponse.ok) {
          toast.success('Cadastro realizado com sucesso! Você será redirecionado.');
          const { token, usuario } = await loginResponse.json();
          logaUsuario(usuario, token, true);

          if (usuario.tipo === 'lider') {
            navigate('/empresa/editar'); // Redireciona para a página de edição da empresa
          } else {
            navigate('/'); // Redireciona para a página inicial para outros tipos
          }
        } else {
          throw new Error('Falha ao fazer login após o cadastro.');
        }
      } else {
        if (response.status === 409) {
          toast.error('Este e-mail já está em uso.');
        } else {
          const errorData = await response.json();
          // Exibe a primeira mensagem de erro de validação do Zod vinda do backend
          if (errorData.errors && Array.isArray(errorData.errors)) {
            toast.error(errorData.errors[0].message);
          } else {
            toast.error('Erro ao realizar o cadastro. Tente novamente.');
          }
        }
      }
    } catch (error) {
      toast.error('Erro inesperado. Tente novamente.');
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
              {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">Seu e-mail</label>
              <input type="email" id="email" className="form-input" required {...register("email")} />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Tipo de Conta</label>
              <div className="flex items-center gap-6 mt-2">
                <div className="flex items-center">
                  <input id="tipo-candidato" type="radio" value="candidato" {...register("tipo")} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" defaultChecked />
                  <label htmlFor="tipo-candidato" className="ml-2 text-sm font-medium text-gray-900">
                    Sou um candidato
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="tipo-lider" type="radio" value="lider" {...register("tipo")} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                  <label htmlFor="tipo-lider" className="ml-2 text-sm font-medium text-gray-900">
                    Sou uma empresa
                  </label>
                </div>
              </div>
              {errors.tipo && (
                <p className="text-red-500 text-sm mt-1">{errors.tipo.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="senha" className="block mb-2 text-sm font-medium">Senha</label>
              <input type="password" id="senha" className="form-input" required {...register("senha")} />
              <PasswordStrengthIndicator password={senhaAtual} />
              {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>}
            </div>
            <div>
              <label htmlFor="confirmarSenha" className="block mb-2 text-sm font-medium">Confirmar Senha</label>
              <input type="password" id="confirmarSenha" className="form-input" required {...register("confirmarSenha")} />
              {errors.confirmarSenha && <p className="text-red-500 text-sm mt-1">{errors.confirmarSenha.message}</p>}
            </div>
            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Cadastrar
            </button>
            <p className="text-sm font-light text-gray-500">
              Já possui uma conta? <Link to="/login" className="font-medium text-blue-600 hover:underline">Faça login</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}