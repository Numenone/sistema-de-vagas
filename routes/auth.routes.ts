import { Router } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { authenticateToken } from '../middlewares/auth.middleware';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { updateUsuarioSchema } from '../schemas/usuario.schema';

const router = Router();

// --- Cloudinary/Multer Config (específico para este router) ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'SEU_CLOUD_NAME',
  api_key: process.env.CLOUDINARY_API_KEY || 'SUA_API_KEY',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'SEU_API_SECRET'
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'linkedont_users', allowed_formats: ['jpg', 'png', 'jpeg'] } as any,
});
const upload = multer({ storage });

// --- Rotas de Autenticação e Usuário ---

router.post('/login', authController.login);

router.patch('/usuarios/:id', authenticateToken, upload.single('fotoPerfil'), validate(updateUsuarioSchema), authController.updateUsuario);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password', authController.resetPassword);

// --- GET /api/candidatos/:id (Buscar perfil de um candidato) ---
router.get('/candidatos/:id', authenticateToken, authController.getCandidatoProfile);

export default router;