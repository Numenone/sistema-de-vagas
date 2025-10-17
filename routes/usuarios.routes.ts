import { Router } from 'express';
import {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  loginUsuario,
} from '../controllers/usuarios.controller.ts';
import { validate } from '../middlewares/validate.ts';
import { createUsuarioSchema, updateUsuarioSchema } from '../schemas/usuario.schema.ts';

const usuariosRouter = Router();

usuariosRouter.get('/', getAllUsuarios);
usuariosRouter.get('/:id', getUsuarioById);
usuariosRouter.post('/login', loginUsuario); // Nova rota para login
usuariosRouter.post('/', validate(createUsuarioSchema), createUsuario);
usuariosRouter.put('/:id', validate(createUsuarioSchema), updateUsuario);
usuariosRouter.patch('/:id', validate(updateUsuarioSchema), updateUsuario);
usuariosRouter.delete('/:id', deleteUsuario);

export default usuariosRouter;