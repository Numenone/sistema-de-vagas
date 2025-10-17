import { Router } from 'express';
import { getAllVagas, getVagaById, createVaga, updateVaga, deleteVaga } from '../controllers/vagas.controller.ts';
import { validate } from '../middlewares/validate.ts';
import { createVagaSchema, updateVagaSchema } from '../schemas/vaga.schema.ts';

const vagasRouter = Router();

vagasRouter.get('/', getAllVagas);
vagasRouter.get('/:id', getVagaById);
vagasRouter.post('/', validate(createVagaSchema), createVaga);
vagasRouter.put('/:id', validate(createVagaSchema), updateVaga);
vagasRouter.patch('/:id', validate(updateVagaSchema), updateVaga);
vagasRouter.delete('/:id', deleteVaga);

export default vagasRouter;