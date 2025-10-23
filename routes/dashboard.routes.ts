import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/admin.middleware';
import * as dashboardController from './dashboard.controller';

const router = Router();

// Protege a rota para ser acessível apenas por administradores
router.get('/stats', authenticateToken, isAdmin, dashboardController.getDashboardStats);

export default router;