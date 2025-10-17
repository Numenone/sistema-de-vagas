import express from 'express';
import vagasRouter from './vagas.routes.ts'; // Ensure this path is correct
import usuariosRouter from './usuarios.routes.ts';
import empresasRouter from './empresas.routes.ts';
import candidaturasRouter from './candidaturas.routes.ts';

const routes = express.Router();

routes.use('/vagas', vagasRouter);
routes.use('/usuarios', usuariosRouter);
routes.use('/empresas', empresasRouter);
routes.use('/candidaturas', candidaturasRouter);

export default routes;