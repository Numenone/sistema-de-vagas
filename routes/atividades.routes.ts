import { Router } from 'express';
import * as atividadesController from '../controllers/atividades.controller.js';

const router = Router();

// --- GET /api/atividades/recentes ---
router.get('/recentes', atividadesController.getAtividadesRecentes);

export default router;