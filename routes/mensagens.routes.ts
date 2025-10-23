import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import * as mensagensController from '../controllers/mensagens.controller.js';

const router = Router();

// Rota para LISTAR mensagens de uma candidatura
router.get('/candidatura/:candidaturaId', authenticateToken, mensagensController.getMensagensByCandidatura);

// Rota para CONTAR mensagens não lidas para o usuário logado
router.get('/unread-count', authenticateToken, mensagensController.getUnreadCount);

// Rota para MARCAR mensagens de uma candidatura como lidas
router.patch('/candidatura/:candidaturaId/mark-as-read', authenticateToken, mensagensController.markAsRead);

// Rota para ENVIAR uma mensagem
router.post('/', authenticateToken, mensagensController.enviarMensagem);

export default router;