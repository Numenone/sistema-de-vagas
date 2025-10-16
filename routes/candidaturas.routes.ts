import { Router } from 'express';
import {
  getAllCandidaturas,
  getCandidaturaById,
  createCandidatura,
  updateCandidatura,
  deleteCandidatura,
} from '../controllers/candidaturas.controller';
import { validate } from '../middlewares/validate';
import { createCandidaturaSchema, updateCandidaturaSchema } from '../schemas/candidatura.schema';

const candidaturasRouter = Router();

candidaturasRouter.get('/', getAllCandidaturas);
candidaturasRouter.get('/:id', getCandidaturaById);
candidaturasRouter.post('/', validate(createCandidaturaSchema), createCandidatura);
candidaturasRouter.put('/:id', validate(createCandidaturaSchema), updateCandidatura);
candidaturasRouter.patch('/:id', validate(updateCandidaturaSchema), updateCandidatura);
candidaturasRouter.delete('/:id', deleteCandidatura);

export default candidaturasRouter;

