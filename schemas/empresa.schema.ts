import { z } from 'zod';

export const createEmpresaSchema = z.object({
  body: z.object({
    nome: z
      .string()
      .min(3, 'O nome da empresa deve ter no mínimo 3 caracteres.')
      .max(50, 'O nome da empresa não pode exceder 50 caracteres.'),
    descricao: z
      .string()
      .min(10, 'A descrição deve ter no mínimo 10 caracteres.')
      .max(500, 'A descrição não pode exceder 500 caracteres.'),
  }),
});

export const updateEmpresaSchema = z.object({
  body: z.object({
    nome: z.string().min(3, 'O nome da empresa deve ter no mínimo 3 caracteres.').max(50, 'O nome da empresa não pode exceder 50 caracteres.').optional(),
    descricao: z.string().min(10, 'A descrição deve ter no mínimo 10 caracteres.').max(500, 'A descrição não pode exceder 500 caracteres.').optional(),
  }),
});