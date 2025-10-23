import type { VagaType } from "./VagaType"
import type { UsuarioType } from "./UsuarioType"

export type CandidaturaType = {
    id: number
    usuarioId: number
    vagaId: number
    descricao: string
    status: 'Enviada' | 'Em Análise' | 'Aprovada' | 'Rejeitada'
    createdAt: string
    updatedAt: string | null
    vaga: VagaType
    usuario: UsuarioType
}