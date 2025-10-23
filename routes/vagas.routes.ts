import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import * as vagasController from '../controllers/vagas.controller';
import { validate } from '../middlewares/validate';
import { createVagaSchema, updateVagaSchema } from '../schemas/vaga.schema';

const router = Router();

// --- GET /api/vagas (Listar vagas com filtros e paginação) ---
router.get('/', vagasController.getAllVagas);

// --- POST /api/vagas (Criar vaga) ---
router.post('/', authenticateToken, validate(createVagaSchema), vagasController.createVaga);

// --- GET /api/vagas/:id (Buscar uma vaga) ---
router.get('/:id', vagasController.getVagaByIdWithSimilares);

// --- PATCH /api/vagas/:id (Atualizar vaga) ---
router.patch('/:id', authenticateToken, validate(updateVagaSchema), vagasController.updateVaga);

export default router;