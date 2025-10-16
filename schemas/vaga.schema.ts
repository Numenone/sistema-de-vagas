import { z } from 'zod';

export const createVagaSchema = z.object({
  body: z.object({
    titulo: z.string({ required_error: 'O título é obrigatório.' }).min(3, 'O título deve ter no mínimo 3 caracteres.'),
    descricao: z.string({ required_error: 'A descrição é obrigatória.' }),
    requisitos: z.string({ required_error: 'Os requisitos são obrigatórios.' }),
    salario: z.number({ required_error: 'O salário é obrigatório.' }).positive('O salário deve ser um valor positivo.'),
    empresaId: z.number({ required_error: 'O ID da empresa é obrigatório.' }).int(),
    ativa: z.boolean().optional().default(true),
  }),
});

export const updateVagaSchema = z.object({
  body: z.object({
    titulo: z.string().min(3, 'O título deve ter no mínimo 3 caracteres.').optional(),
    descricao: z.string().optional(),
    requisitos: z.string().optional(),
    salario: z.number().positive('O salário deve ser um valor positivo.').optional(),
    empresaId: z.number().int().optional(),
    ativa: z.boolean().optional(),
  }),
});