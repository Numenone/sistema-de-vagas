import { create } from 'zustand'
import type { UsuarioType } from '../utils/UsuarioType'

interface UsuarioStore {
  usuario: UsuarioType
  logaUsuario: (usuario: UsuarioType, manterConectado?: boolean) => void
  deslogaUsuario: () => void
  carregarUsuarioSalvo: () => void
}

const usuarioInicial: UsuarioType = {
  id: 0,
  nome: '',
  email: '',
  senha: '',
  tipo: 'candidato',
  createdAt: new Date(),
  updatedAt: new Date()
}

export const useUsuarioStore = create<UsuarioStore>((set) => ({
  usuario: usuarioInicial,
  
  logaUsuario: (usuario: UsuarioType, manterConectado = false) => {
    set({ usuario })
    if (manterConectado) {
      localStorage.setItem("usuarioData", JSON.stringify(usuario))
    } else {
      sessionStorage.setItem("usuarioData", JSON.stringify(usuario))
    }
  },
  
  deslogaUsuario: () => {
    set({ usuario: usuarioInicial })
    localStorage.removeItem("usuarioData")
    sessionStorage.removeItem("usuarioData")
  },
  
  carregarUsuarioSalvo: () => {
    const usuarioSalvo = localStorage.getItem("usuarioData") || sessionStorage.getItem("usuarioData")
    if (usuarioSalvo) {
      try {
        const usuario = JSON.parse(usuarioSalvo)
        set({ usuario })
      } catch (error) {
        console.error("Erro ao carregar usuário salvo:", error)
        localStorage.removeItem("usuarioData")
        sessionStorage.removeItem("usuarioData")
      }
    }
  }
}))