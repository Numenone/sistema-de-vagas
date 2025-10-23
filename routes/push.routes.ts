import { Router } from 'express';
import * as pushController from '../controllers/push.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Rota pública para obter a chave VAPID
router.get('/vapid-key', pushController.getVapidKey);

// Rota protegida para que um usuário se inscreva para receber notificações
router.post('/subscribe', authenticateToken, pushController.subscribe);

export default router;