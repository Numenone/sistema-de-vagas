import { z } from 'zod';

export const createUsuarioSchema = z.object({
  body: z.object({
    nome: z.string().refine(val => val !== null && val !== undefined && val.trim() !== '', { message: 'O nome é obrigatório.' }),
    email: z.string().email('Formato de email inválido.').refine(val => val !== null && val !== undefined && val.trim() !== '', { message: 'O email é obrigatório.' }),
    senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.').refine(val => val !== null && val !== undefined && val.trim() !== '', { message: 'A senha é obrigatória.' }),
    tipo: z.enum(['candidato', 'lider', 'admin']).refine(val => val !== null && val !== undefined, { message: 'O tipo é obrigatório.' }),
    empresaId: z.number().int().optional(),
  }),
});

export const updateUsuarioSchema = z.object({
  body: z.object({
    nome: z.string().optional(),
    email: z.string().email('Formato de email inválido.').optional(),
    senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.').optional(),
    tipo: z.enum(['candidato', 'lider', 'admin']).optional(),
    empresaId: z.number().int().optional().nullable(),
  }),
});