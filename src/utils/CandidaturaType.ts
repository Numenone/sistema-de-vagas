import type { VagaType } from "./VagaType.js"
import type { UsuarioType } from "./UsuarioType.js"

export const STATUS_CANDIDATURA = ['Enviada', 'Em Análise', 'Aprovada', 'Rejeitada'] as const;
export type StatusCandidatura = typeof STATUS_CANDIDATURA[number];

export const statusStyles: Record<StatusCandidatura, string> = {
    Enviada: 'bg-blue-100 text-blue-800 border-blue-200',
    'Em Análise': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Aprovada: 'bg-green-100 text-green-800 border-green-200',
    Rejeitada: 'bg-red-100 text-red-800 border-red-200',
};

export type CandidaturaType = {
    id: number
    usuarioId: number
    vagaId: number
    descricao: string
    status: StatusCandidatura
    createdAt: string
    updatedAt: string | null
    vaga: VagaType
    usuario: UsuarioType
}