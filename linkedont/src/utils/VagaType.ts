import type { EmpresaType } from "./EmpresaType"

export type VagaType = {
    id: number
    titulo: string
    descricao: string
    requisitos: string
    salario: number
    ativa: boolean
    createdAt: Date
    updatedAt: Date
    empresaId: number
    empresa: EmpresaType
}