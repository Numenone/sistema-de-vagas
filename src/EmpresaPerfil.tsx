import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { CardVaga } from './component/CardVaga';
import type { EmpresaType } from './utils/EmpresaType';
import type { VagaType } from './utils/VagaType';
import { useUsuarioStore } from './context/UsuarioContext';
import { PaginationControls } from './component/PaginationControls';

const apiUrl = import.meta.env.VITE_API_URL;

interface EmpresaComVagas extends EmpresaType {
    vagas: VagaType[];
    totalVagas: number;
    totalPages: number;
    currentPage: number;
}

export default function EmpresaPerfil() {
    const { id } = useParams();
    const [empresa, setEmpresa] = useState<EmpresaComVagas | null>(null);
    const [loading, setLoading] = useState(true);
    const { usuario } = useUsuarioStore();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        async function fetchEmpresa() {
            try {
                setLoading(true);
                const params = new URLSearchParams({ page: currentPage.toString() });
                const response = await fetch(`${apiUrl}/api/empresas/${id}?${params.toString()}`);
                if (!response.ok) throw new Error("Empresa não encontrada.");
                const data = await response.json();
                setEmpresa(data);
            } catch (error) {
                toast.error("Erro ao carregar dados da empresa.");
                setEmpresa(null); // Limpa em caso de erro para evitar mostrar dados antigos
            } finally {
                setLoading(false);
            }
        }
        if (id) {
            fetchEmpresa();
        }
    }, [id, currentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return <div className="p-6 text-center">Carregando perfil da empresa...</div>;
    }

    if (!empresa) {
        return <div className="p-6 text-center">Perfil da empresa não encontrado.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="card mb-8 flex flex-col md:flex-row items-center gap-8">
                <img 
                    src={empresa.logo || "https://via.placeholder.com/160x160?text=Logo"} 
                    alt={`Logo da ${empresa.nome}`} 
                    className="w-40 h-40 object-contain border p-2 rounded-lg bg-white"
                />
                <div>
                    <h1 className="text-4xl font-bold mb-2">{empresa.nome}</h1>
                    <p className="text-gray-600">{empresa.descricao}</p>
                    {usuario.tipo === 'admin' && (
                        <Link to={`/admin/empresas/${empresa.id}/editar`} className="btn-primary mt-4 inline-block">
                            Editar Empresa
                        </Link>
                    )}
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">Vagas Ativas ({empresa.totalVagas})</h2>
            {empresa.vagas.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {empresa.vagas.map(vaga => (
                            <CardVaga key={vaga.id} data={vaga} />
                        ))}
                    </div>
                    {empresa.totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <PaginationControls 
                                currentPage={empresa.currentPage} 
                                totalPages={empresa.totalPages} 
                                onPageChange={handlePageChange} />
                        </div>
                    )}
                </>
            ) : (
                <p className="text-gray-500">Esta empresa não possui vagas ativas no momento.</p>
            )}
        </div>
    );
}