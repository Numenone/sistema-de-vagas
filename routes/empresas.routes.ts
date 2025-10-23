import { Router } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import * as empresasController from '../controllers/empresas.controller';
import { validate } from '../middlewares/validate';
import { updateEmpresaSchema } from '../schemas/empresa.schema';

const router = Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'SEU_CLOUD_NAME',
  api_key: process.env.CLOUDINARY_API_KEY || 'SUA_API_KEY',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'SEU_API_SECRET'
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'linkedont_empresas', allowed_formats: ['jpg', 'png', 'jpeg'] } as any,
});
const upload = multer({ storage });

router.get('/', empresasController.getAllEmpresas);
router.get('/:id', empresasController.getEmpresaByIdWithVagas); // Agora esta função existe
router.patch('/:id', upload.single('logo'), validate(updateEmpresaSchema), empresasController.updateEmpresa);

export default router;
