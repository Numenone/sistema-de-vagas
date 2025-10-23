import { Router } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import * as empresaController from '../controllers/empresa.controller.js';

const router = Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'linkedont_logos', allowed_formats: ['jpg', 'png', 'jpeg'] },
});
const upload = multer({ storage });

router.get('/', empresaController.getAllEmpresasAdmin);
router.post('/', upload.single('logo'), empresaController.createEmpresa);

export default router;