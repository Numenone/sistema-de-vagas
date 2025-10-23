import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// É crucial que esta chave secreta seja guardada em variáveis de ambiente em produção!
const JWT_SECRET = process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO';



export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, JWT_SECRET, async (err: any, payload: any) => {
    if (err) {
      return res.sendStatus(403); // Forbidden (token inválido)
    }

    const usuario = await prisma.usuario.findUnique({ where: { id: payload.id } });
    if (!usuario) return res.sendStatus(404); // Usuário não encontrado
    
    req.usuario = usuario; // Anexa o usuário à requisição
    next();
  });
};