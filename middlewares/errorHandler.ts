import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction // O _next é necessário para que o Express o reconheça como um middleware de erro.
) => {
  console.error(err); // É uma boa prática logar o erro no servidor.

  // Erros de validação do Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Erro de validação.',
      errors: err.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  // Erros do Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Violação de restrição única (ex: email já existe)
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ');
      return res.status(409).json({ status: 'error', message: `O valor para ${target} já está em uso.` });
    }
  }

  // Erros customizados com statusCode (lançados pelos seus services)
  if ('statusCode' in err) {
    const statusCode = (err as any).statusCode;
    return res.status(statusCode).json({ status: 'error', message: err.message });
  }

  // Erro genérico para qualquer outra situação
  return res.status(500).json({ status: 'error', message: 'Ocorreu um erro interno no servidor.' });
};