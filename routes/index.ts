import { Router } from 'express';
import vagasRouter from '../vagas.routes';
import usuariosRouter from './usuarios.routes';
import empresasRouter from './empresas.routes';
import candidaturasRouter from './candidaturas.routes';

const routes = Router();

routes.use('/api/vagas', vagasRouter);
routes.use('/api/usuarios', usuariosRouter);
routes.use('/api/empresas', empresasRouter);
routes.use('/api/candidaturas', candidaturasRouter);

export default routes;