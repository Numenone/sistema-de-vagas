import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// --- GET /api/habilidades (Listar todas as habilidades) ---
router.get('/', async (req, res) => {
    try {
        const habilidades = await prisma.habilidade.findMany({ orderBy: { nome: 'asc' } });
        res.json(habilidades);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar habilidades' });
    }
});

export default router;