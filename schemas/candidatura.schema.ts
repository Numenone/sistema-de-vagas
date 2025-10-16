import { z } from 'zod';

export const createCandidaturaSchema = z.object({
  body: z.object({
    usuarioId: z.number({ required_error: 'O ID do usuário é obrigatório.' }).int(),
    vagaId: z.number({ required_error: 'O ID da vaga é obrigatório.' }).int(),
    descricao: z.string({ required_error: 'A descrição da candidatura é obrigatória.' }),
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