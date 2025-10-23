import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1].trim();

  if (!token || typeof token !== 'string' || token === 'null') {
    return res.sendStatus(401);
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET.trim()) as JwtPayload;

    if (typeof payload !== 'object' || !payload.id) {
      return res.sendStatus(403);
    }

    const usuario = await prisma.usuario.findUnique({ where: { id: Number(payload.id) } });

    if (!usuario) {
      return res.sendStatus(404);
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    // Pass errors to the global error handler
    next(error);
  }
};