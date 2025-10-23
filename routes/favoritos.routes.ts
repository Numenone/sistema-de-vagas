import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import * as favoritosController from '../controllers/favoritos.controller.js';

const router = Router();

// --- GET /api/favoritos (Listar vagas favoritas do usuário logado) ---
router.get('/', authenticateToken, favoritosController.getFavoritos);

// --- POST /api/favoritos/:vagaId (Adicionar vaga aos favoritos) ---
router.post('/:vagaId', authenticateToken, favoritosController.addFavorito);

// --- DELETE /api/favoritos/:vagaId (Remover vaga dos favoritos) ---
router.delete('/:vagaId', authenticateToken, favoritosController.removeFavorito);

export default router;