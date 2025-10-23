import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/admin.middleware';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import * as adminEmpresasController from '../controllers/empresas.admin.controller';

const router = Router();

// Configuração do Cloudinary (similar à de auth.routes.ts)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'linkedont_empresas', allowed_formats: ['jpg', 'png', 'jpeg'] } as any,
});
const upload = multer({ storage });

// --- GET /api/admin/empresas (Admin lista todas as empresas) ---
router.get('/', authenticateToken, isAdmin, adminEmpresasController.getEmpresas);

// --- PATCH /api/admin/empresas/:id/status (Ativar/Desativar uma empresa) ---
router.patch('/:id/status', authenticateToken, isAdmin, adminEmpresasController.updateStatusEmpresa);

// --- PATCH /api/admin/empresas/:id (Admin atualiza uma empresa) ---
router.patch('/:id', authenticateToken, isAdmin, upload.single('logo'), adminEmpresasController.updateEmpresa);

export default router;