import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { Request } from 'express';

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

const router = Router();
const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'SEU_CLOUD_NAME',
  api_key: process.env.CLOUDINARY_API_KEY || 'SUA_API_KEY',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'SEU_API_SECRET'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'linkedont_empresas',
    allowed_formats: ['jpg', 'png', 'jpeg']
  } as any,
});

const upload = multer({ storage });

router.get('/', async (_req, res) => {
    const empresas = await prisma.empresa.findMany({ orderBy: { nome: 'asc' } });
    res.json(empresas);
});

router.get('/:id', async (req, res) => {
    try {
        const empresa = await prisma.empresa.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                vagas: {
                    where: { ativa: true },
                }
            }
        });
        if (!empresa) {
            return res.status(404).json({ error: 'Empresa não encontrada' });
        }
        res.json(empresa);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar empresa' });
    }
});

router.patch('/:id', upload.single('logo'), async (req: MulterRequest, res) => {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    const dataToUpdate: any = {};

    if (nome) dataToUpdate.nome = nome;
    if (descricao) dataToUpdate.descricao = descricao;
    if (req.file) dataToUpdate.logo = req.file.path;

    try {
        const empresaAtualizada = await prisma.empresa.update({ where: { id: Number(id) }, data: dataToUpdate });
        res.json(empresaAtualizada);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar empresa' });
    }
});

export default router;
