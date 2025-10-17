import { Router } from 'express';
import { Prisma } from '@prisma/client'; // Corrigido para importar Prisma
import multer from 'multer'; // Importação corrigida
import { CloudinaryStorage } from 'multer-storage-cloudinary'; // Removido Options
import { v2 as cloudinary } from 'cloudinary';

// Extende o tipo Request para incluir 'file'
import { Request } from 'express';
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

const PrismaClient = Prisma.PrismaClient;

const router = Router();
const prisma = new PrismaClient();

// --- Cloudinary/Multer Config ---
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'SEU_CLOUD_NAME',
  api_key: process.env.CLOUDINARY_API_KEY || 'SUA_API_KEY',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'SEU_API_SECRET'
});
router.get('/', async (_req, res) => {
    const empresas = await prisma.empresa.findMany({ orderBy: { nome: 'asc' } });
    res.json(empresas);
});
const upload = multer({ storage });

// --- Rotas de Empresas ---

router.get('/', async (req, res) => {
    const empresas = await prisma.empresa.findMany({ orderBy: { nome: 'asc' } });
    res.json(empresas);
});

router.get('/:id', async (req, res) => {
    const empresa = await prisma.empresa.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            vagas: {
                where: { ativa: true },
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

    try {
        const empresaAtualizada = await prisma.empresa.update({ where: { id: Number(id) }, data: dataToUpdate });
        res.json(empresaAtualizada);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar empresa' });
    }
});

export default router;