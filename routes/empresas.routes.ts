import { Router } from 'express';
import {
  getAllEmpresas,
  getEmpresaById,
  createEmpresa,
  updateEmpresa,
  deleteEmpresa,
} from '../controllers/empresas.controller.ts';
import { validate } from '../middlewares/validate.ts';
import { createEmpresaSchema, updateEmpresaSchema } from '../schemas/empresa.schema.ts';

const empresasRouter = Router();

empresasRouter.get('/', getAllEmpresas);
empresasRouter.get('/:id', getEmpresaById);
empresasRouter.post('/', validate(createEmpresaSchema), createEmpresa);
empresasRouter.put('/:id', validate(createEmpresaSchema), updateEmpresa);
empresasRouter.patch('/:id', validate(updateEmpresaSchema), updateEmpresa);
empresasRouter.delete('/:id', deleteEmpresa);

export default empresasRouter;