import { Router } from 'express';
import {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from '../controllers/usuarios.controller';
import { validate } from '../middlewares/validate';
import { createUsuarioSchema, updateUsuarioSchema } from '../schemas/usuario.schema';

const usuariosRouter = Router();

usuariosRouter.get('/', getAllUsuarios);
usuariosRouter.get('/:id', getUsuarioById);
usuariosRouter.post('/', validate(createUsuarioSchema), createUsuario);
usuariosRouter.put('/:id', validate(createUsuarioSchema), updateUsuario); // PUT usa o schema de criação
usuariosRouter.patch('/:id', validate(updateUsuarioSchema), updateUsuario);
usuariosRouter.delete('/:id', deleteUsuario);

export default usuariosRouter;