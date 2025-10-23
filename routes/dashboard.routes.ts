import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/admin.middleware';

const router = Router();

// Rota para obter estatísticas gerais do dashboard (protegida para admins)
router.get('/', authenticateToken, isAdmin, dashboardController.getDashboardStats);

export default router;