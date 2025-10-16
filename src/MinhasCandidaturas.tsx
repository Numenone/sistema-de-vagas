import { useEffect, useState } from "react";
import { useUsuarioStore } from "./context/UsuarioContext";
import type { CandidaturaType } from "./utils/CandidaturaType";
import React from 'react'

const apiUrl = import.meta.env.VITE_API_URL;

export default function MinhasCandidaturas() {
    const [candidaturas, setCandidaturas] = useState<CandidaturaType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { usuario } = useUsuarioStore();

    useEffect(() => {
        async function buscaCandidaturas() {
            try {
                setLoading(true);
                setError(null);
                
                if (!usuario.id) {
                    setError("Usuário não está logado");
                    setLoading(false);
                    return;
                }

                console.log("🔄 Buscando candidaturas para usuário ID:", usuario.id);
                
                const responseCandidaturas = await fetch(`${apiUrl}/candidaturas?usuarioId=${usuario.id}`);
                
                if (!responseCandidaturas.ok) {
                    throw new Error(`Erro ao buscar candidaturas: ${responseCandidaturas.status}`);
                }
                
                const candidaturasData = await responseCandidaturas.json();
                console.log("📋 Candidaturas encontradas:", candidaturasData);

                if (candidaturasData.length === 0) {
                    setCandidaturas([]);
                    setLoading(false);
                    return;
                }

                const candidaturasCompletas = await Promise.all(
                    candidaturasData.map(async (candidatura: any) => {
                        try {
                            const responseVaga = await fetch(`${apiUrl}/vagas/${candidatura.vagaId}?_expand=empresa`);
                            if (!responseVaga.ok) {
                                console.error("Erro ao buscar vaga:", candidatura.vagaId);
                                return {
                                    ...candidatura,
                                    vaga: { titulo: "Vaga não encontrada", empresa: { nome: "N/A" } }
                                };
                            }
                            const vagaData = await responseVaga.json();

                            return {
                                ...candidatura,
                                vaga: vagaData
                            };
                        } catch (error) {
                            console.error("Erro ao processar candidatura:", candidatura.id, error);
                            return {
                                ...candidatura,
                                vaga: { titulo: "Erro ao carregar", empresa: { nome: "N/A" } }
                            };
                        }
                    })
                );

                console.log("✅ Candidaturas completas:", candidaturasCompletas);
                setCandidaturas(candidaturasCompletas);
                
            } catch (error) {
                console.error("❌ Erro ao buscar candidaturas:", error);
                setError("Erro ao carregar candidaturas. Tente novamente.");
            } finally {
                setLoading(false);
            }
        }

        buscaCandidaturas();
    }, [usuario.id]);

    function formatarData(data: string) {
        try {
            const date = new Date(data);
            return date.toLocaleDateString('pt-BR');
        } catch (error) {
            return "Data inválida";
        }
    }

    function formatarSalario(salario: number) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(salario);
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pendente':
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case 'visualizada':
                return "bg-blue-100 text-blue-800 border-blue-200";
            case 'aprovada':
                return "bg-green-100 text-green-800 border-green-200";
            case 'rejeitada':
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pendente': return 'Pendente';
            case 'visualizada': return 'Visualizada';
            case 'aprovada': return 'Aprovada';
            case 'rejeitada': return 'Rejeitada';
            default: return status;
        }
    };

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto p-6">
                <h1 className="mb-6 text-3xl font-extrabold leading-none tracking-tight text-gray-900">
                    Minhas <span className="underline underline-offset-3 decoration-8 decoration-orange-400">Candidaturas</span>
                </h1>
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando suas candidaturas...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="max-w-7xl mx-auto p-6">
                <h1 className="mb-6 text-3xl font-extrabold leading-none tracking-tight text-gray-900">
                    Minhas <span className="underline underline-offset-3 decoration-8 decoration-orange-400">Candidaturas</span>
                </h1>
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900">
                        {error}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Tente recarregar a página ou verificar sua conexão.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-7xl mx-auto p-6">
            <h1 className="mb-6 text-3xl font-extrabold leading-none tracking-tight text-gray-900">
                Minhas <span className="underline underline-offset-3 decoration-8 decoration-orange-400">Candidaturas</span>
            </h1>

            {candidaturas.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h2 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900">
                        Você ainda não se candidatou a nenhuma vaga
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Explore as vagas disponíveis e candidate-se às que mais combinam com seu perfil!
                    </p>
                    <a 
                        href="/" 
                        className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Ver Vagas Disponíveis
                    </a>
                </div>
            ) : (
                <>
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow text-center">
                            <div className="text-2xl font-bold text-blue-600">{candidaturas.length}</div>
                            <div className="text-sm text-gray-600">Total</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                                {candidaturas.filter(c => c.status === 'pendente').length}
                            </div>
                            <div className="text-sm text-gray-600">Pendentes</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {candidaturas.filter(c => c.status === 'aprovada').length}
                            </div>
                            <div className="text-sm text-gray-600">Aprovadas</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {candidaturas.filter(c => c.status === 'visualizada').length}
                            </div>
                            <div className="text-sm text-gray-600">Visualizadas</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {candidaturas.map(candidatura => (
                            <div key={candidatura.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {candidatura.vaga?.titulo || "Vaga não encontrada"}
                                        </h3>
                                        
                                        <div className="flex items-center text-gray-700 mb-2">
                                            <span className="font-semibold">Empresa:</span>
                                            <span className="ml-2">{candidatura.vaga?.empresa?.nome || "N/A"}</span>
                                        </div>

                                        <div className="flex items-center text-gray-700 mb-2">
                                            <span className="font-semibold">Salário:</span>
                                            <span className="ml-2">
                                                {candidatura.vaga?.salario ? formatarSalario(candidatura.vaga.salario) : "N/A"}
                                            </span>
                                        </div>

                                        <div className="mb-3">
                                            <span className="font-semibold text-gray-700">Sua mensagem:</span>
                                            <p className="text-gray-600 mt-1 bg-gray-50 p-3 rounded">
                                                {candidatura.descricao}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="md:text-right md:ml-4 mt-4 md:mt-0">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(candidatura.status)}`}>
                                            {getStatusText(candidatura.status)}
                                        </span>
                                        
                                        <div className="mt-2 text-sm text-gray-600">
                                            <div>Enviada em: {formatarData(candidatura.createdAt)}</div>
                                            {candidatura.updatedAt && candidatura.updatedAt !== candidatura.createdAt && (
                                                <div>Atualizada em: {formatarData(candidatura.updatedAt)}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}