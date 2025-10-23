import { Router } from 'express';
import { createUsuario, getAllUsuarios, getUsuarioById } from '../controllers/usuarios.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/admin.middleware.js';
import { validate } from '../middlewares/validate.js';
import { createUsuarioSchema } from '../schemas/usuario.schema.js';

const router = Router();

// Rota para listar todos os usuários (protegida para admins)
router.get('/', authenticateToken, isAdmin, getAllUsuarios);

// Rota para criar um novo usuário (pública)
router.post('/', validate(createUsuarioSchema), createUsuario);

// Rota para buscar um usuário específico por ID
router.get('/:id', authenticateToken, getUsuarioById);

export default router;