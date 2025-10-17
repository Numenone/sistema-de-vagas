import { useForm } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"
import { useUsuarioStore } from "./context/UsuarioContext"
import React from 'react'

type Inputs = {
    email: string
    senha: string
    manter: boolean
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Login() {
    const { register, handleSubmit } = useForm<Inputs>()    
    const { logaUsuario } = useUsuarioStore()

    const navigate = useNavigate()

    async function verificaLogin(data: Inputs) {
        try {
            const response = await fetch(`${apiUrl}/api/usuarios/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: data.email,
                    senha: data.senha
                })
            });

            if (response.ok) {
                const usuario = await response.json();
                logaUsuario(usuario, data.manter);
                
                navigate("/")
            } else {
                toast.error("Erro... Email ou senha incorretos")
            }
        } catch (error) {
            console.error("Erro no login:", error)
            toast.error("Erro de conexão")
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