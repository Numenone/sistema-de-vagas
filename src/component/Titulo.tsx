import { Link } from "react-router-dom"
import { useUsuarioStore } from "../context/UsuarioContext"
import { useNavigate } from "react-router-dom"
import React from 'react'

const apiUrl = import.meta.env.VITE_API_URL;

export default function Titulo() {
    const { usuario, deslogaUsuario } = useUsuarioStore()
    const navigate = useNavigate()

    function usuarioSair() {
        if (confirm("Confirma saída do sistema?")) {
            deslogaUsuario()
            navigate("/login")
        }
    }

    return (
        <nav className="header-dark">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap">
                        Sistema de Vagas
                    </span>
                </Link>

                <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
                    <ul className="flex flex-col font-medium mt-4 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
                        <li>
                            {usuario.id ? (
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={usuario.fotoPerfil ? `${apiUrl}${usuario.fotoPerfil}` : `https://ui-avatars.com/api/?name=${usuario.nome}&background=random`} 
                                        alt="Foto de perfil"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <span className="text-white font-bold">{usuario.nome}</span>
                                        <div className="text-xs text-gray-300">{usuario.tipo}</div>
                                    </div>
                                    <Link to="/perfil/editar" className="text-white hover:text-blue-200 text-sm underline">
                                        Editar Perfil
                                    </Link>
                                    
                                    {usuario.tipo === 'candidato' && (
                                        <>
                                            <Link to="/minhasCandidaturas" className="text-white bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded-lg">
                                                Minhas Candidaturas
                                            </Link>
                                            <Link to="/favoritos" className="text-white bg-pink-600 hover:bg-pink-700 px-3 py-2 rounded-lg">
                                                Favoritos
                                            </Link>
                                        </>
                                    )}
                                    
                                    {usuario.tipo === 'lider' && (
                                        <>
                                            <Link to="/empresa/editar" className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg">
                                                Editar Empresa
                                            </Link>
                                            <Link to="/empresa/vagas" className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg">
                                                Gerenciar Vagas
                                            </Link>
                                        </>
                                    )}

                                    {usuario.tipo === 'admin' && (
                                        <>
                                            <Link to="/admin/dashboard" className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg">
                                                Dashboard
                                            </Link>
                                            <Link to="/admin/vagas" className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg">
                                                Vagas
                                            </Link>
                                            <Link to="/admin/candidaturas" className="text-white bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg">
                                                Candidaturas
                                            </Link>
                                        </>
                                    )}
                                    
                                    <button 
                                        onClick={usuarioSair} 
                                        className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
                                    >
                                        Sair
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="block py-2 px-3 md:p-0 rounded-sm hover:bg-gray-700">
                                    Entrar
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}