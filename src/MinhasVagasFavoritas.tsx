import { useEffect, useState } from 'react';
import { useUsuarioStore } from './context/UsuarioContext';
import type { VagaType } from './utils/VagaType';
import CardVaga from './component/CardVaga';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

export default function MinhasVagasFavoritas() {
    const [vagas, setVagas] = useState<VagaType[]>([]);
    const [loading, setLoading] = useState(true);
    const { fetchAutenticado } = useUsuarioStore() as any;

    useEffect(() => {
        async function fetchFavoritos() {
            try { 
                const response = await fetchAutenticado(`${apiUrl}/api/favoritos`);
                if (!response.ok) throw new Error("Falha ao buscar favoritos.");
                const data = await response.json();
                setVagas(data);
            } catch (error) {
                toast.error("Erro ao carregar vagas favoritas.");
            } finally {
                setLoading(false);
            }
        }
        fetchFavoritos();
    }, []);

    if (loading) {
        return <div className="p-6 text-center">Carregando...</div>;
    }

    return (
        <section className="max-w-7xl mx-auto p-6">
            <h1 className="mb-8 text-3xl font-bold">Minhas Vagas Favoritas</h1>
            {vagas.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">❤️</div>
                    <h3 className="text-xl font-semibold mb-2">Você ainda não favoritou nenhuma vaga.</h3>
                    <p className="text-gray-600">
                        Clique no coração nas vagas que te interessam para salvá-las aqui.
                    </p>
                    <Link to="/" className="mt-4 btn-primary">
                        Explorar Vagas
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vagas.map(vaga => (
                        <CardVaga key={vaga.id} data={vaga} />
                    ))}
                </div>
            )}
        </section>
    );
}