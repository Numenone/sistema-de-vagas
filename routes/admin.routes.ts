import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/admin.middleware';
import * as adminController from '../controllers/admin.controller';

const router = Router();

// Aplicar middlewares para todas as rotas neste arquivo
router.use(authenticateToken, isAdmin);

// --- GET /api/admin/usuarios (Listar todos os usuários) ---
router.get('/usuarios', adminController.getUsuarios);

// --- PATCH /api/admin/usuarios/:id (Alterar a permissão de um usuário) ---
router.patch('/usuarios/:id', adminController.updatePermissaoUsuario);

// --- PATCH /api/admin/usuarios/:id/status (Ativar/Desativar um usuário) ---
router.patch('/usuarios/:id/status', adminController.updateStatusUsuario);

// --- PATCH /api/admin/usuarios/:id/soft-delete (Admin soft-deletes a user) ---
router.patch('/usuarios/:id/soft-delete', adminController.softDeleteUser);

export default router;