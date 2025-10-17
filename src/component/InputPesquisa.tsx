import { useForm } from "react-hook-form";
import React from 'react'

type Inputs = {
    termo: string;
}

type InputPesquisaProps = {
    onSearch: (termo: string) => void; // Chamado no submit
    onInputChange: (termo: string) => void; // Chamado no onChange
}

export function InputPesquisa({ onSearch, onInputChange }: InputPesquisaProps) {
    const { register, handleSubmit, reset } = useForm<Inputs>();

    async function enviaPesquisa(data: Inputs) {
        onSearch(data.termo);
    }

    async function mostraTodas() {
        reset({ termo: "" });
        onInputChange(""); // Limpa o filtro no App.tsx
    }

    return (
        <div className="max-w-4xl mx-auto">
            <form id="form-pesquisa" onSubmit={handleSubmit(enviaPesquisa)} className="mb-4">
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-white sr-only">
                    Pesquisar vagas
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input 
                        type="search" 
                        id="default-search" 
                        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Pesquisar por título da vaga, empresa ou tecnologia..." 
                        {...register('termo', {
                            onChange: (e) => onInputChange(e.target.value)
                        })} 
                    />
                    <button 
                        type="submit" 
                        className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                    >
                        Pesquisar
                    </button>
                </div>
            </form>
            
            <div className="text-center">
                <button 
                    onClick={mostraTodas}
                    className="text-white hover:text-blue-200 text-sm underline"
                >
                    Ver todas as vagas disponíveis
                </button>
            </div>
        </div>
    );
}