import { z } from 'zod';

export const createVagaSchema = z.object({
  body: z.object({
    titulo: z.string().min(3, 'O título deve ter no mínimo 3 caracteres.').refine(val => val !== null && val !== undefined && val.trim() !== '', { message: 'O título é obrigatório.' }),
    descricao: z.string().refine(val => val !== null && val !== undefined && val.trim() !== '', { message: 'A descrição é obrigatória.' }),
    requisitos: z.string().refine(val => val !== null && val !== undefined && val.trim() !== '', { message: 'Os requisitos são obrigatórios.' }),
    salario: z.number().positive('O salário deve ser um valor positivo.').refine(val => val !== null && val !== undefined, { message: 'O salário é obrigatório.' }),
    empresaId: z.number().int().refine(val => val !== null && val !== undefined, { message: 'O ID da empresa é obrigatório.' }),
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