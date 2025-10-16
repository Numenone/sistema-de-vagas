import { z } from 'zod';

export const createEmpresaSchema = z.object({
  body: z.object({
    nome: z.string({ required_error: 'O nome da empresa é obrigatório.' }),
    descricao: z.string({ required_error: 'A descrição é obrigatória.' }),
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