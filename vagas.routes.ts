import { Router } from 'express';
import { getAllVagas, getVagaById, createVaga, updateVaga, deleteVaga } from '../controllers/vagas.controller';
import { validate } from '../middlewares/validate';
import { createVagaSchema, updateVagaSchema } from '../schemas/vaga.schema';

const vagasRouter = Router();

vagasRouter.get('/', getAllVagas);
vagasRouter.get('/:id', getVagaById);
vagasRouter.post('/', validate(createVagaSchema), createVaga);
vagasRouter.put('/:id', validate(createVagaSchema), updateVaga);
vagasRouter.patch('/:id', validate(updateVagaSchema), updateVaga);
vagasRouter.delete('/:id', deleteVaga);

export default vagasRouter;