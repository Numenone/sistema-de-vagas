import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/admin.middleware.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import * as adminEmpresasController from '../controllers/empresas.admin.controller.js';
import { validate } from '../middlewares/validate.js';
import { createEmpresaSchema } from '../schemas/empresa.schema.js';

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

// --- POST /api/admin/empresas (Admin cria uma nova empresa) ---
router.post('/', authenticateToken, isAdmin, upload.single('logo'), validate(createEmpresaSchema), adminEmpresasController.createEmpresa);

// --- GET /api/admin/empresas/:id/lideres (Admin lista os líderes de uma empresa) ---
router.get('/:id/lideres', authenticateToken, isAdmin, adminEmpresasController.getLideresByEmpresa);

// --- POST /api/admin/empresas/:id/associar-lider (Admin associa um líder a uma empresa) ---
router.post('/:id/associar-lider', authenticateToken, isAdmin, adminEmpresasController.associarNovoLider);

// --- PATCH /api/admin/empresas/:id/status (Ativar/Desativar uma empresa) ---
router.patch('/:id/status', authenticateToken, isAdmin, adminEmpresasController.updateStatusEmpresa);

// --- PATCH /api/admin/empresas/:id (Admin atualiza uma empresa) ---
router.patch('/:id', authenticateToken, isAdmin, upload.single('logo'), adminEmpresasController.updateEmpresa);

// --- DELETE /api/admin/empresas/:id (Admin deleta uma empresa) ---
router.delete('/:id', authenticateToken, isAdmin, adminEmpresasController.deleteEmpresa);

// --- PATCH /api/admin/empresas/:id/restore (Admin restaura uma empresa) ---
router.patch('/:id/restore', authenticateToken, isAdmin, adminEmpresasController.restoreEmpresa);

export default router;