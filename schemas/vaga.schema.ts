import { z } from 'zod';

export const createVagaSchema = z.object({
  body: z.object({
    titulo: z.string().min(1, 'O título é obrigatório.'),
    descricao: z.string().min(10, 'A descrição deve ter no mínimo 10 caracteres.'),
    requisitos: z.string().min(1, 'Os requisitos são obrigatórios.'),
    // Coerce (converte) a string recebida do formulário para um número
    salario: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.coerce.number({ required_error: "O salário é obrigatório.", invalid_type_error: 'O salário deve ser um número.' }).nonnegative('O salário deve ser um número positivo.')
    ),
    empresaId: z.coerce.number().int().positive('A empresa é obrigatória.'),
    modalidade: z.preprocess(
      (val) => (typeof val === 'string' ? val.toUpperCase().replace('Í', 'I') : val),
      z.enum(['REMOTO', 'HIBRIDO', 'PRESENCIAL'])
    ),
    tipoContrato: z.enum(['CLT', 'PJ']),
    ativa: z.boolean().optional().default(true),
    // Habilidades é um array de IDs (números)
    habilidades: z.array(z.coerce.number().int()).optional(),
  }),
});

export const updateVagaSchema = z.object({
  body: z.object({
    titulo: z.string().min(1, 'O título é obrigatório.').optional(),
    descricao: z.string().min(10, 'A descrição deve ter no mínimo 10 caracteres.').optional(),
    requisitos: z.string().min(1, 'Os requisitos são obrigatórios.').optional(),
    salario: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : val),
      z.coerce.number({ invalid_type_error: 'O salário deve ser um número.' }).nonnegative('O salário deve ser um número positivo.').optional()
    ),
    // empresaId não deve ser alterado em uma atualização de vaga
    modalidade: z.preprocess(
      (val) => (typeof val === 'string' ? val.toUpperCase().replace('Í', 'I') : val),
      z.enum(['REMOTO', 'HIBRIDO', 'PRESENCIAL'])
    ).optional(),
    tipoContrato: z.enum(['CLT', 'PJ']).optional(),
    ativa: z.boolean().optional(),
    habilidades: z.array(z.coerce.number().int()).optional(),
  }),
});