export type UsuarioType = {
    fotoPerfil: any
    fotoPerfil: any
    id: number
    nome: string
    email: string
    senha: string
    tipo: 'candidato' | 'admin' | 'lider'
    empresaId?: number
    createdAt: Date
    updatedAt: Date
}