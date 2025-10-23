import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import * as empresaManagementController from '../controllers/empresa.management.controller';
import { validate } from '../middlewares/validate';
import { associarLiderSchema } from '../schemas/empresa.management.schema';

const router = Router();

// Middleware para garantir que o usuário é um líder com uma empresa associada
const isLeaderWithCompany = (req: Request, res: Response, next: NextFunction) => {
  if (req.usuario?.tipo !== 'lider' || !req.usuario.empresaId) {
    return res.status(403).json({ error: 'Acesso negado. Rota exclusiva para líderes de empresa.' });
  }
  next();
};

router.use(authenticateToken, isLeaderWithCompany);

// Rota para listar os líderes da empresa do usuário logado
router.get('/lideres', empresaManagementController.getLideres);

// Rota para associar um usuário existente como líder da empresa
router.post('/associar-lider', validate(associarLiderSchema), empresaManagementController.associarNovoLider);

export default router;