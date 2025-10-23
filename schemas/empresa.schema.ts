import { z } from 'zod';

export const createEmpresaSchema = z.object({
  body: z.object({
    nome: z.string().refine(val => val !== null && val !== undefined && val.trim() !== '', { message: 'O nome da empresa é obrigatório.' }),
    descricao: z.string().min(10, 'A descrição deve ter no mínimo 10 caracteres.')
  }),
});

export const updateEmpresaSchema = z.object({
  body: z.object({
    nome: z.string().optional(),
    descricao: z.string().optional(),
  }),
});