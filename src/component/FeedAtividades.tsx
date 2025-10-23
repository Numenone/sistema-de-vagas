import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL;

interface Atividade {
    id: string;
    tipo: 'vaga' | 'candidatura';
    data: string;
    texto: string;
    subtexto: string;
    link: string;
}

export function FeedAtividades() {
    const [atividades, setAtividades] = useState<Atividade[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAtividades() {
            try {
                const response = await fetch(`${apiUrl}/api/atividades/recentes`);
                const data = await response.json();
                setAtividades(data);
            } catch (error) {
                console.error("Erro ao buscar atividades:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAtividades();
    }, []);

    if (loading) {
        return <div className="text-center p-4">Carregando atividades...</div>;
    }

    return (
        <div className="card">
            <h2 className="text-xl font-bold mb-4">Atividades Recentes</h2>
            <ul className="space-y-4">
                {atividades.map(atividade => (
                    <li key={atividade.id} className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${atividade.tipo === 'vaga' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                            {atividade.tipo === 'vaga' ? <Briefcase size={20} /> : <FileText size={20} />}
                        </div>
                        <div>
                            <Link to={atividade.link} className="font-semibold text-gray-800 hover:underline">
                                {atividade.texto}
                            </Link>
                            <p className="text-sm text-gray-600">{atividade.subtexto}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {(() => {
                                    const date = new Date(atividade.data);
                                    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
                                    let interval = seconds / 31536000;
                                    if (interval > 1) return `${Math.floor(interval)} anos atrás`;
                                    interval = seconds / 2592000;
                                    if (interval > 1) return `${Math.floor(interval)} meses atrás`;
                                    interval = seconds / 86400;
                                    if (interval > 1) return `${Math.floor(interval)} dias atrás`;
                                    interval = seconds / 3600;
                                    if (interval > 1) return `${Math.floor(interval)} horas atrás`;
                                    interval = seconds / 60;
                                    if (interval > 1) return `${Math.floor(interval)} minutos atrás`;
                                    return "agora mesmo";
                                })()}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}