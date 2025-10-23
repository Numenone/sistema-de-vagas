import { Link } from "react-router-dom";
import { useUsuarioStore } from "../context/UsuarioContext";
import React from 'react';
import UserMenu from "./UserMenu"; // Importa o novo componente

export default function Titulo() {
    const { usuario } = useUsuarioStore();

    return (
        <nav className="header-dark">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap">Sistema de Vagas</span>
                </Link>

                <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
                    <ul className="flex flex-col font-medium mt-4 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
                        <li>
                            {usuario.id ? <UserMenu /> : (
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