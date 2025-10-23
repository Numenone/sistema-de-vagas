export type UsuarioType = {
    id: number
    nome: string
    email: string
    senha?: string
    tipo: 'candidato' | 'admin' | 'lider'
    empresaId?: number
    fotoPerfil: string | null
    ativo: boolean
    createdAt: Date
    updatedAt: Date
}