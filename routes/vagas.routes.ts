import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// --- GET /api/vagas (Listar vagas com filtros e paginação) ---
router.get('/', async (req, res) => {
    const { q, salario, empresaNome, status, page = '1', limit = '6', empresaId, modalidade, tipoContrato, habilidades } = req.query;

    try {
        const pageNum = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * pageSize;

        const where: any = {};

        if (status !== 'all') {
            where.ativa = true;
        }

        if (empresaId) {
            where.empresaId = Number(empresaId);
        }

        if (q && typeof q === 'string') {
            where.OR = [
                { titulo: { contains: q, mode: 'insensitive' } },
                { descricao: { contains: q, mode: 'insensitive' } },
                { requisitos: { contains: q, mode: 'insensitive' } },
            ];
        }

        if (salario && typeof salario === 'string') {
            const [min, max] = salario.split('-').map(Number);
            where.salario = {};
            if (!isNaN(min)) where.salario.gte = min;
            if (max) where.salario.lte = max;
        }

        if (empresaNome && typeof empresaNome === 'string') {
            where.empresa = { nome: empresaNome };
        }

        if (modalidade && typeof modalidade === 'string') {
            where.modalidade = modalidade;
        }

        if (tipoContrato && typeof tipoContrato === 'string') {
            where.tipoContrato = tipoContrato;
        }

        if (habilidades && typeof habilidades === 'string') {
            const listaHabilidades = habilidades.split(',');
            where.habilidades = { some: { nome: { in: listaHabilidades, mode: 'insensitive' } } };
        }

        const [vagas, totalVagas] = await prisma.$transaction([
            prisma.vaga.findMany({
                where,
                include: { empresa: true },
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.vaga.count({ where })
        ]);

        res.json({
            vagas,
            totalPages: Math.ceil(totalVagas / pageSize),
            currentPage: pageNum,
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar vagas' });
    }
});

// --- POST /api/vagas (Criar vaga) ---
router.post('/', authenticateToken, async (req, res) => {
    const { titulo, descricao, requisitos, salario, modalidade, tipoContrato, empresaId: adminEmpresaId } = req.body;
    const user = req.usuario;

    let empresaId: number | undefined;

    if (user?.tipo === 'lider') {
        empresaId = user.empresaId ?? undefined;
    } else if (user?.tipo === 'admin') {
        empresaId = Number(adminEmpresaId);
    }

    if (!empresaId) {
        return res.status(403).json({ error: 'Acesso negado ou empresa não especificada.' });
    }

    try {
        const novaVaga = await prisma.vaga.create({
            data: { 
                titulo,
                descricao,
                requisitos,
                salario: Number(salario),
                empresaId,
                modalidade: modalidade || 'Presencial',
                tipoContrato: tipoContrato || 'CLT',
                ativa: true
            },
        });
        res.status(201).json(novaVaga);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno ao criar vaga' });
    }
});

// --- GET /api/vagas/:id (Buscar uma vaga) ---
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const vaga = await prisma.vaga.findUnique({
            where: { id: Number(id) },
            include: {
                empresa: true,
                habilidades: true // Inclui as habilidades da vaga principal
            },
        });

        if (!vaga) {
            return res.status(404).json({ error: 'Vaga não encontrada' });
        }

        // Busca por vagas similares
        const habilidadesIds = vaga.habilidades.map(h => h.id);
        const vagasSimilares = await prisma.vaga.findMany({
            where: {
                id: { not: vaga.id }, // Exclui a própria vaga
                ativa: true,
                OR: [
                    { empresaId: vaga.empresaId }, // Da mesma empresa
                    { habilidades: { some: { id: { in: habilidadesIds } } } } // Com pelo menos uma habilidade em comum
                ]
            },
            include: { empresa: true },
            take: 3 // Limita a 3 vagas similares
        });

        res.json({
            vaga,
            vagasSimilares
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar vaga' });
    }
});

// --- PATCH /api/vagas/:id (Atualizar vaga) ---
router.patch('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { ativa } = req.body;

    try {
        if (req.usuario?.tipo === 'lider') {
            const vaga = await prisma.vaga.findUnique({ where: { id: Number(id) } });
            if (vaga?.empresaId !== req.usuario.empresaId) {
                return res.status(403).json({ error: 'Você não tem permissão para editar esta vaga.' });
            }
        } else if (req.usuario?.tipo !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado.' });
        }

        const vagaAtualizada = await prisma.vaga.update({
            where: { id: Number(id) },
            data: { ativa },
        });
        res.json(vagaAtualizada);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno ao atualizar vaga' });
    }
});

export default router;