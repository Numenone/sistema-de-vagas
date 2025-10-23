import { Router } from 'express';
import * as habilidadesController from '../controllers/habilidades.controller.js';

const router = Router();

// --- GET /api/habilidades (Listar todas as habilidades) ---
router.get('/', habilidadesController.getAllHabilidades);

export default router;