import { z } from 'zod';

export const associarLiderSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'O e-mail é obrigatório.' }).email('Formato de e-mail inválido.'),
  }),
});