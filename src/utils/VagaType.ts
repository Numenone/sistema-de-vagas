import type { EmpresaType } from "./EmpresaType"
import type { HabilidadeType } from "./HabilidadeType"

export type VagaType = {
    id: number
    titulo: string
    descricao: string
    requisitos: string
    salario: number
    modalidade: string
    tipoContrato: string
    ativa: boolean
    createdAt: Date
    updatedAt: Date
    empresaId: number
    empresa: EmpresaType
    habilidades: HabilidadeType[]
}