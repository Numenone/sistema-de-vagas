import { z } from 'zod';

export const createEmpresaSchema = z.object({
  body: z.object({
    nome: z.string().refine(val => val !== null && val !== undefined && val.trim() !== '', { message: 'O nome da empresa é obrigatório.' }),
    descricao: z.string().refine(val => val !== null && val !== undefined && val.trim() !== '', { message: 'A descrição é obrigatória.' }),
    logo: z.string().url({ message: 'URL do logo inválida.' }),
  }),
});

export const updateEmpresaSchema = z.object({
  body: z.object({
    nome: z.string().optional(),
    descricao: z.string().optional(),
    logo: z.string().url({ message: 'URL do logo inválida.' }).optional(),
  }),
});