import { useForm } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"
import { useUsuarioStore } from "./context/UsuarioContext.js"

type Inputs = {
    email: string
    senha: string
    manter: boolean
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Login() {
    const { register, handleSubmit } = useForm<Inputs>();
    const navigate = useNavigate();
    const { logaUsuario, fetchFavoritos } = useUsuarioStore();
    async function verificaLogin(data: Inputs) {
        try {
            // 1. Alterado para uma requisição POST com os dados no corpo (body)
            const response = await fetch(`${apiUrl || ''}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    senha: data.senha,
                }),
            });

            // 2. Tratamento de resposta baseado no status HTTP
            if (response.ok) {
                const { token, usuario } = await response.json();
                // O backend não deve retornar a senha.
                // Se retornar, é uma boa prática removê-la aqui.
                // delete usuario.senha; // A senha não deve ser retornada pelo backend
                logaUsuario(usuario, token, data.manter);
                if (usuario.tipo === 'candidato') {
                    fetchFavoritos(); // Busca os favoritos após o login
                }
                navigate("/")
            } else if (response.status === 401) {
                // 401 Unauthorized: Credenciais inválidas
                toast.error("Erro... Email ou senha incorretos");
            } else {
                // Outros erros do servidor
                toast.error("Ocorreu um erro no servidor. Tente novamente.");
            }
        } catch (error) {
            console.error("Erro no login:", error)
            toast.error("Falha na conexão com o servidor. Verifique sua internet.");
        }
    }

    return (
        <section className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <div className="p-6 space-y-4">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900">
                        Dados de Acesso
                    </h1>
                    <form className="space-y-4" onSubmit={handleSubmit(verificaLogin)}>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Seu e-mail</label>
                            <input 
                                type="email" 
                                id="email" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                required 
                                {...register("email")} 
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Senha</label>
                            <input 
                                type="password" 
                                id="password" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                required 
                                {...register("senha")} 
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input 
                                        id="remember" 
                                        aria-describedby="remember" 
                                        type="checkbox" 
                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" 
                                        {...register("manter")} 
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="remember" className="text-gray-500">Manter Conectado</label>
                                </div>
                            </div>
                            <Link to="/esqueci-senha" className="text-sm font-medium text-blue-600 hover:underline">
                                Esqueci minha senha
                            </Link>
                        </div>
                        <button 
                            type="submit" 
                            className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Entrar
                        </button>
                        <p className="text-sm font-light text-gray-500">
                            Ainda não possui conta? <Link to="/cadastro" className="font-medium text-blue-600 hover:underline">Cadastre-se</Link>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    )
}