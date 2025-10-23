import express from 'express';
import authRouter from './auth.routes';
import vagasRouter from './vagas.routes';
import empresasRouter from './empresas.routes';
import candidaturasRouter from './candidaturas.routes';
import dashboardRouter from './dashboard.routes';
import habilidadesRouter from './habilidades.routes';
import favoritosRouter from './favoritos.routes';
import atividadesRouter from './atividades.routes';
import adminRouter from './admin.routes';
import adminEmpresasRouter from './empresas.admin.routes';
import mensagensRouter from './mensagens.routes';
import pushRouter from './push.routes';
import empresaManagementRouter from './empresa.management.routes';
import { pusherAuth } from '../websocket';

const routes = express.Router();

routes.use('/', authRouter);
routes.use('/vagas', vagasRouter);
routes.use('/empresas', empresasRouter);
routes.use('/candidaturas', candidaturasRouter);
routes.use('/dashboard', dashboardRouter);
routes.use('/habilidades', habilidadesRouter);
routes.use('/favoritos', favoritosRouter);
routes.use('/atividades', atividadesRouter);
routes.use('/admin', adminRouter);
routes.use('/admin/empresas', adminEmpresasRouter);
routes.use('/mensagens', mensagensRouter);
routes.use('/push', pushRouter);
routes.use('/empresa', empresaManagementRouter);

// Rota de autenticação para canais privados/presence do Pusher
routes.post('/pusher/auth', pusherAuth);

export default routes;