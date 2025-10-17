import { create } from 'zustand';
import type { UsuarioType } from '../utils/UsuarioType';
import type { VagaType } from '../utils/VagaType';

const apiUrl = import.meta.env.VITE_API_URL;

interface UsuarioState {
  usuario: UsuarioType;
  token: string | null;
  favoritos: number[]; // Armazena apenas os IDs das vagas favoritas
  logaUsuario: (usuario: UsuarioType, token: string, manter: boolean) => void;
  deslogaUsuario: () => void;
  carregarUsuarioSalvo: () => void;
  fetchAutenticado: (url: string, options?: RequestInit) => Promise<Response>;
  fetchFavoritos: () => Promise<void>;
}

const usuarioVazio: UsuarioType = {
  id: 0,
  nome: '',
  email: '',
  senha: '',
  tipo: 'candidato',
  createdAt: new Date(),
  updatedAt: new Date(),
  fotoPerfil: null,
};

export const useUsuarioStore = create<UsuarioState>((set, get) => ({
  usuario: usuarioVazio,
  token: null,
  favoritos: [],

  logaUsuario: (usuario, token, manter) => { // logaUsuario agora também busca os favoritos
    set({ usuario, token });
    if (manter) {
      localStorage.setItem('usuario', JSON.stringify({ usuario, token }));
    } else {
      sessionStorage.setItem('usuario', JSON.stringify({ usuario, token }));
    }
  },

  deslogaUsuario: () => {
    set({ usuario: usuarioVazio, token: null, favoritos: [] });
    localStorage.removeItem('usuario');
    sessionStorage.removeItem('usuario');
  },

  carregarUsuarioSalvo: () => {
    const usuarioSalvo = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
    if (usuarioSalvo) {
      const { usuario, token } = JSON.parse(usuarioSalvo);
      set({ usuario, token });
      get().fetchFavoritos(); // Busca favoritos ao carregar o usuário
    }
  },

  fetchAutenticado: (url, options = {}) => {
    const { token } = get();
    const headers = new Headers(options.headers);

    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    // Para requisições com FormData, não definimos o Content-Type
    if (!(options.body instanceof FormData)) {
      headers.append('Content-Type', 'application/json');
    }

    return fetch(url, { ...options, headers });
  },

  fetchFavoritos: async () => {
    const { token } = get();
    if (!token) return;

    try {
      const response = await get().fetchAutenticado(`${apiUrl}/api/favoritos`);
      const vagasFavoritas: VagaType[] = await response.json();
      const idsFavoritos = vagasFavoritas.map(vaga => vaga.id);
      set({ favoritos: idsFavoritos });
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
    }
  },
}));