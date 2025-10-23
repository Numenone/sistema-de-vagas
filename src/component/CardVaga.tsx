import { Link } from "react-router-dom";
import type { VagaType } from "../utils/VagaType";
import { useState, useEffect } from 'react';
import { useUsuarioStore } from "../context/UsuarioContext";
import { Heart } from 'lucide-react';
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_API_URL;

export function CardVaga({ data }: { data: VagaType }) {
    const { usuario, fetchAutenticado, favoritos, fetchFavoritos } = useUsuarioStore();
    const [isFavorito, setIsFavorito] = useState(false);

    useEffect(() => {
        setIsFavorito(favoritos.some(favId => favId === data.id));
    }, [favoritos, data.id]);

    const handleFavoritar = async (e: React.MouseEvent) => {
        e.preventDefault(); // Impede a navegação ao clicar no botão
        if (!usuario.id || usuario.tipo !== 'candidato') {
            toast.info("Faça login como candidato para favoritar vagas.");
            return;
        }

        const method = isFavorito ? 'DELETE' : 'POST';
        try {
            const response = await fetchAutenticado(`${apiUrl}/api/favoritos/${data.id}`, { method });
            if (response.ok) {
                // Atualiza a lista de favoritos no estado global
                fetchFavoritos();
            } else {
                throw new Error("Falha ao atualizar favorito.");
            }
        } catch (error) {
            toast.error("Erro ao interagir com favoritos.");
        }
    };

    return (
        <Link to={`/detalhes/${data.id}`} className="relative bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
            {usuario.tipo === 'candidato' && (
                <button onClick={handleFavoritar} className="absolute top-3 right-3 z-10 p-2 bg-white/70 rounded-full hover:bg-white transition-colors">
                    <Heart className={`w-5 h-5 ${isFavorito ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
                </button>
            )}
            <div className="flex justify-center items-center h-48 bg-gray-100 rounded-t-lg p-4">
                {data.empresa && (
                    <img 
                        className="h-32 w-auto object-contain max-w-full"
                        src={data.empresa.logo || `https://ui-avatars.com/api/?name=${data.empresa.nome.charAt(0)}&background=random`}
                        alt={`Logo da ${data.empresa.nome}`}
                        onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlNWU3ZWIiLz48dGV4dCB4PSIxMDAiIHk9IjUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NzY4NkEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkxvZ28gTMOjbyBEaXNwb27DrXZlbDwvdGV4dD48L3N2Zz4=";
                        }}
                    />
                )}
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">{data.titulo}</h5>
                {data.empresa && <p className="mb-4 font-normal text-gray-600">{data.empresa.nome}</p>}
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                    <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
                        </svg>
                        <span>R$ {Number(data.salario).toLocaleString("pt-br", {
                            minimumFractionDigits: 2,
                        })}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                        </svg>
                        <span>{data.modalidade || 'Não especificado'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path></svg>
                        <span>{data.tipoContrato || 'Não especificado'}</span>
                    </div>
                </div>
                
                <div className="mt-auto">
                    <div className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">Ver Detalhes</div>
                </div>
            </div>
        </Link>
    );
}