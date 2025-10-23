import { z } from 'zod';

export const associarLiderSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'O e-mail é obrigatório.').email('Formato de e-mail inválido.'),
  }),
});