import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUsuarioStore } from './context/UsuarioContext.js';
import type { UsuarioType } from './utils/UsuarioType.js';
import { Mail, Calendar } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL;

export default function PerfilCandidato() {
  const { id } = useParams();
  const { fetchAutenticado } = useUsuarioStore();
  const navigate = useNavigate();
  const [candidato, setCandidato] = useState<UsuarioType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCandidato() {
      try {
        const response = await fetchAutenticado(`${apiUrl}/api/candidatos/${id}`);
        if (!response.ok) {
          throw new Error('Candidato não encontrado ou acesso negado.');
        }
        const data = await response.json();
        setCandidato(data);
      } catch (error: any) {
        toast.error(error.message);
        navigate(-1); // Volta para a página anterior
      } finally {
        setLoading(false);
      }
    }
    fetchCandidato();
  }, [id, fetchAutenticado, navigate]);

  if (loading) {
    return <div className="p-6 text-center">Carregando perfil...</div>;
  }

  if (!candidato) {
    return <div className="p-6 text-center">Perfil não encontrado.</div>;
  }

  const fotoSrc = candidato.fotoPerfil 
    ? candidato.fotoPerfil 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(candidato.nome)}&background=random&color=fff`;

  return (
    <section className="max-w-4xl mx-auto p-6">
      <div className="card text-center">
        <img src={fotoSrc} alt={`Foto de ${candidato.nome}`} className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg" />
        <h1 className="text-3xl font-bold">{candidato.nome}</h1>
        <div className="mt-4 flex justify-center items-center gap-6 text-gray-600">
          <div className="flex items-center gap-2">
            <Mail size={18} />
            <span>{candidato.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span>Membro desde: {new Date(candidato.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}