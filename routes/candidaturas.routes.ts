import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import * as candidaturasController from '../controllers/candidaturas.controller.js';
import { validate } from '../middlewares/validate.js';
import { createCandidaturaSchema, updateCandidaturaSchema } from '../schemas/candidatura.schema.js';

const router = Router();

// Rota para o LÍDER ver as candidaturas da sua empresa
router.get('/empresa', authenticateToken, candidaturasController.getAllCandidaturasByEmpresa);

// Rota para o CANDIDATO ver suas próprias candidaturas
router.get('/usuario/:usuarioId', authenticateToken, candidaturasController.getAllCandidaturasByUsuario);

// Rota para o ADMIN ver TODAS as candidaturas (usada em GerenciarCandidaturas)
router.get('/', authenticateToken, candidaturasController.getAllCandidaturas);

// Rota para criar uma candidatura
router.post('/', authenticateToken, validate(createCandidaturaSchema), candidaturasController.createCandidatura);

// Rota para atualizar o status de uma candidatura (usada pelo Admin e Líder)
router.patch('/:id', authenticateToken, validate(updateCandidaturaSchema), candidaturasController.updateCandidatura);

export default router;