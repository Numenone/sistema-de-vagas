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
import usuariosRouter from './usuarios.routes'; // Importa o novo router
import { pusherAuth } from './websocket';
import { authenticateToken } from '../middlewares/auth.middleware';

const routes = express.Router();

routes.use('/auth', authRouter);
routes.use('/vagas', vagasRouter);
routes.use('/usuarios', usuariosRouter); // Adiciona o novo router
routes.use('/empresas', empresasRouter);
routes.use('/habilidades', habilidadesRouter);
routes.use('/candidaturas', candidaturasRouter);
routes.use('/favoritos', favoritosRouter);
routes.use('/atividades', atividadesRouter);
routes.use('/admin/dashboard-stats', dashboardRouter);
routes.use('/admin/empresas', adminEmpresasRouter); // Rota mais específica primeiro
routes.use('/admin', adminRouter); // Rota mais genérica depois
routes.use('/mensagens', mensagensRouter);
routes.use('/push', pushRouter);
routes.use('/empresa', empresaManagementRouter);

// Rota de autenticação para canais privados/presence do Pusher
routes.post('/pusher/auth', authenticateToken, pusherAuth); // Adicionado middleware de autenticação

export default routes;