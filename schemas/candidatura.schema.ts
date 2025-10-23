import { z } from 'zod';

export const createCandidaturaSchema = z.object({
  body: z.object({
    usuarioId: z.number().int().refine(val => val !== null && val !== undefined, { message: 'O ID do usuário é obrigatório.' }),
    vagaId: z.number().int().refine(val => val !== null && val !== undefined, { message: 'O ID da vaga é obrigatório.' }),
    descricao: z.string().refine(val => val !== null && val !== undefined && val.trim() !== '', { message: 'A descrição da candidatura é obrigatória.' }),
    status: z.string().optional().default('pendente'),
  }),
});

export const updateCandidaturaSchema = z.object({
  body: z.object({
    usuarioId: z.number().int().optional(),
    vagaId: z.number().int().optional(),
    descricao: z.string().optional(),
    status: z.string().optional(),
  }),
});