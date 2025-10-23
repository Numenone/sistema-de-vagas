import { z } from 'zod';

export const passwordValidation = z.string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres.')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula.')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula.')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número.')
  .regex(/[^a-zA-Z0-9]/, 'A senha deve conter pelo menos um caractere especial.');

export const createUsuarioSchema = z.object({
  body: z.object({
    nome: z.string().refine(val => val !== null && val !== undefined && val.trim() !== '', { message: 'O nome é obrigatório.' }),
    email: z.string().email('Formato de email inválido.').refine(val => val !== null && val !== undefined && val.trim() !== '', { message: 'O email é obrigatório.' }),
    senha: passwordValidation,
    tipo: z.enum(['candidato', 'lider', 'admin']).refine(val => val !== null && val !== undefined, { message: 'O tipo é obrigatório.' }),
    empresaId: z.number().int().optional(),
  }),
});

export const updateUsuarioSchema = z.object({
  body: z.object({
    nome: z.string().optional(),
    email: z.string().email('Formato de email inválido.').optional(),
    senha: passwordValidation.optional(),
    tipo: z.enum(['candidato', 'lider', 'admin']).optional(),
    empresaId: z.number().int().optional().nullable(),
  }),
});