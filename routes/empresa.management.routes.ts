import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import * as empresaManagementController from '../controllers/empresa.management.controller.js';
import { validate } from '../middlewares/validate.js';
import { createEmpresaSchema, updateEmpresaSchema } from '../schemas/empresa.schema.js';

const router = Router();

// --- Cloudinary/Multer Config ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'linkedont_logos', allowed_formats: ['jpg', 'png', 'jpeg'] } as any,
});
const upload = multer({ storage });

const isLeader = (req: Request, res: Response, next: NextFunction) => {
  if (req.usuario?.tipo !== 'lider') {
    return res.status(403).json({ error: 'Acesso negado. Rota exclusiva para líderes.' });
  }
  next();
};

// Aplica os middlewares para todas as rotas deste arquivo
router.use(authenticateToken, isLeader);

// Rotas para o líder gerenciar sua própria empresa
router.get('/me/stats', empresaManagementController.getMinhaEmpresaStats); // Nova rota
router.get('/me', empresaManagementController.getMinhaEmpresa);
router.post('/', upload.single('logo'), validate(createEmpresaSchema), empresaManagementController.createMinhaEmpresa);
router.patch('/', upload.single('logo'), validate(updateEmpresaSchema), empresaManagementController.updateMinhaEmpresa);

// Rota para listar os líderes da empresa do usuário logado
router.get('/lideres', empresaManagementController.getLideres);

export default router;