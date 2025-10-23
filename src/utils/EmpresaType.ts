import { UsuarioType } from "./UsuarioType.js";

export type EmpresaType = {
    id: number;
    nome: string;
    descricao: string;
    logo?: string | null;
    ativo: boolean;
    createdAt: string;
    updatedAt: string;
    lideres?: Partial<UsuarioType>[];
};