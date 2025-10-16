import { z } from 'zod';

export const createUsuarioSchema = z.object({
  body: z.object({
    nome: z.string({ required_error: 'O nome é obrigatório.' }),
    email: z.string({ required_error: 'O email é obrigatório.' }).email('Formato de email inválido.'),
    senha: z.string({ required_error: 'A senha é obrigatória.' }).min(6, 'A senha deve ter no mínimo 6 caracteres.'),
    tipo: z.enum(['candidato', 'lider', 'admin'], { required_error: 'O tipo é obrigatório.' }),
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