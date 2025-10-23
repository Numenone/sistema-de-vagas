import { useEffect, useState } from "react";
import { useUsuarioStore } from "./context/UsuarioContext.js";
import type { CandidaturaType } from "./utils/CandidaturaType.js";
import React from 'react';
import ChatModal from "./component/ChatModal.js"; // Importar o modal
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_API_URL;

export default function MinhasCandidaturas() {
    const [candidaturas, setCandidaturas] = useState<CandidaturaType[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroStatus, setFiltroStatus] = useState('todas');
    const [error, setError] = useState<string | null>(null);
    const { usuario, fetchAutenticado, fetchUnreadCount } = useUsuarioStore();
    const [chatAberto, setChatAberto] = useState<CandidaturaType | null>(null);

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
                const response = await fetchAutenticado(`${apiUrl}/api/candidaturas/usuario/${usuario.id}?status=${filtroStatus}`);
                
                if (!response.ok) {
                    throw new Error(`Erro ao buscar candidaturas: ${response.status}`);
                }
                
                const candidaturasCompletas = await response.json();
                console.log("✅ Candidaturas completas recebidas:", candidaturasCompletas);

                setCandidaturas(candidaturasCompletas);
                
            } catch (error) {
                console.error("❌ Erro ao buscar candidaturas:", error);
                setError("Erro ao carregar candidaturas. Tente novamente.");
            } finally {
                setLoading(false);
            }
        }

        buscaCandidaturas();
    }, [usuario.id, filtroStatus, fetchAutenticado]);

    async function handleOpenChat(candidatura: CandidaturaType) {
        setChatAberto(candidatura);
        // Marca as mensagens como lidas no backend
        try {
            await fetchAutenticado(`${apiUrl}/api/mensagens/candidatura/${candidatura.id}/mark-as-read`, {
                method: 'PATCH',
            });
            // Atualiza a contagem de não lidas no estado global
            fetchUnreadCount();
        } catch (error) {
            toast.error("Erro ao marcar mensagens como lidas.");
        }
    }

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
        const styles: Record<string, string> = {
            Enviada: 'bg-blue-100 text-blue-800 border-blue-200',
            'Em Análise': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            Aprovada: 'bg-green-100 text-green-800 border-green-200',
            Rejeitada: 'bg-red-100 text-red-800 border-red-200',
          };
        return styles[status] || "bg-gray-100 text-gray-800 border-gray-200";
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

            <div className="mb-6 flex flex-wrap gap-2">
                <button onClick={() => setFiltroStatus('todas')} className={`btn ${filtroStatus === 'todas' ? 'btn-primary' : 'btn-secondary'}`}>
                    Todas
                </button>
                <button onClick={() => setFiltroStatus('Enviada')} className={`btn ${filtroStatus === 'Enviada' ? 'btn-primary' : 'btn-secondary'}`}>
                    Enviadas
                </button>
                <button onClick={() => setFiltroStatus('Em Análise')} className={`btn ${filtroStatus === 'Em Análise' ? 'btn-primary' : 'btn-secondary'}`}>
                    Em Análise
                </button>
                <button onClick={() => setFiltroStatus('Aprovada')} className={`btn ${filtroStatus === 'Aprovada' ? 'btn-primary' : 'btn-secondary'}`}>
                    Aprovadas
                </button>
                <button onClick={() => setFiltroStatus('Rejeitada')} className={`btn ${filtroStatus === 'Rejeitada' ? 'btn-primary' : 'btn-secondary'}`}>
                    Rejeitadas
                </button>
            </div>

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
                                {candidaturas.filter(c => c.status === 'Em Análise').length}
                            </div>
                            <div className="text-sm text-gray-600">Em Análise</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {candidaturas.filter(c => c.status === 'Aprovada').length}
                            </div>
                            <div className="text-sm text-gray-600">Aprovadas</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {candidaturas.filter(c => c.status === 'Rejeitada').length}
                            </div>
                            <div className="text-sm text-gray-600">Rejeitadas</div>
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
                                            {candidatura.status}
                                        </span>
                                        
                                        <div className="mt-2 text-sm text-gray-600">
                                            <div>Enviada em: {formatarData(candidatura.createdAt)}</div>
                                            {candidatura.updatedAt && candidatura.updatedAt !== candidatura.createdAt && (
                                                <div>Atualizada em: {formatarData(candidatura.updatedAt)}</div>
                                            )}
                                        </div>
                                        <button onClick={() => handleOpenChat(candidatura)} className="btn-secondary mt-4">
                                            Ver Mensagens
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
            {chatAberto && (
                <ChatModal candidatura={chatAberto} onClose={() => setChatAberto(null)} />
            )}
        </section>
    );
}