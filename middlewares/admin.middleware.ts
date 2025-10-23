import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Este middleware deve ser usado DEPOIS do authenticateToken
  if (req.usuario?.tipo !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Rota exclusiva para administradores.' });
  }
  next();
};