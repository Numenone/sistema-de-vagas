import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// --- GET /api/favoritos (Listar vagas favoritas do usuário logado) ---
router.get('/', authenticateToken, async (req, res) => {
    if (!req.usuario) return res.status(401).json({ error: 'Usuário não autenticado' });

    try {
        const usuarioComFavoritos = await prisma.usuario.findUnique({
            where: { id: req.usuario.id },
            include: {
                vagasFavoritas: {
                    include: { empresa: true }
                }
            }
        });
        res.json(usuarioComFavoritos?.vagasFavoritas || []);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar vagas favoritas' });
    }
});

// --- POST /api/favoritos/:vagaId (Adicionar vaga aos favoritos) ---
router.post('/:vagaId', authenticateToken, async (req, res) => {
    if (!req.usuario) return res.status(401).json({ error: 'Usuário não autenticado' });

    const { vagaId } = req.params;
    try {
        await prisma.usuario.update({
            where: { id: req.usuario.id },
            data: {
                vagasFavoritas: { connect: { id: Number(vagaId) } }
            }
        });
        res.status(200).json({ message: 'Vaga favoritada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao favoritar vaga' });
    }
});

// --- DELETE /api/favoritos/:vagaId (Remover vaga dos favoritos) ---
router.delete('/:vagaId', authenticateToken, async (req, res) => {
    if (!req.usuario) return res.status(401).json({ error: 'Usuário não autenticado' });

    const { vagaId } = req.params;
    try {
        await prisma.usuario.update({
            where: { id: req.usuario.id },
            data: {
                vagasFavoritas: { disconnect: { id: Number(vagaId) } }
            }
        });
        res.status(200).json({ message: 'Vaga removida dos favoritos' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover favorito' });
    }
});

export default router;