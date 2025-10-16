import { Router } from 'express';
import {
  getAllEmpresas,
  getEmpresaById,
  createEmpresa,
  updateEmpresa,
  deleteEmpresa,
} from '../controllers/empresas.controller';
import { validate } from '../middlewares/validate';
import { createEmpresaSchema, updateEmpresaSchema } from '../routes/empresa.schema';

const empresasRouter = Router();

empresasRouter.get('/', getAllEmpresas);
empresasRouter.get('/:id', getEmpresaById);
empresasRouter.post('/', validate(createEmpresaSchema), createEmpresa);
empresasRouter.put('/:id', validate(createEmpresaSchema), updateEmpresa);
empresasRouter.patch('/:id', validate(updateEmpresaSchema), updateEmpresa);
empresasRouter.delete('/:id', deleteEmpresa);

export default empresasRouter;