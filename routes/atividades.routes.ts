import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();

// --- GET /api/atividades/recentes ---
router.get('/recentes', async (req, res) => {
    try {
        const limite = 7; // Número de itens a buscar de cada tabela

        const novasVagas = await prisma.vaga.findMany({
            take: limite,
            orderBy: { createdAt: 'desc' },
            where: { ativa: true },
            include: { empresa: { select: { nome: true } } },
        });

        const novasCandidaturas = await prisma.candidatura.findMany({
            take: limite,
            orderBy: { createdAt: 'desc' },
            include: {
                vaga: { select: { id: true, titulo: true } },
                usuario: { select: { nome: true } }
            },
        });

        // Mapeia os dados para um formato comum
        const atividadesVagas = novasVagas.map(vaga => ({
            id: `vaga-${vaga.id}`,
            tipo: 'vaga',
            data: vaga.createdAt,
            texto: `Nova vaga: ${vaga.titulo}`,
            subtexto: `na empresa ${vaga.empresa.nome}`,
            link: `/detalhes/${vaga.id}`
        }));
        
        const atividadesCandidaturas = novasCandidaturas.map(candidatura => ({
            id: `candidatura-${candidatura.id}`,
            tipo: 'candidatura',
            data: candidatura.createdAt,
            texto: `${candidatura.usuario.nome} se candidatou`,
            subtexto: `para a vaga de ${candidatura.vaga.titulo}`,
            link: `/detalhes/${candidatura.vaga.id}`
        }));

        // Combina, ordena e limita o resultado final
        const atividades = [...atividadesVagas, ...atividadesCandidaturas]
            .sort((a, b) => b.data.getTime() - a.data.getTime())
            .slice(0, 10);

        res.json(atividades);
    } catch (error) {
        console.error("Erro ao buscar atividades recentes:", error);
        res.status(500).json({ error: 'Erro ao buscar atividades recentes' });
    }
});

export default router;