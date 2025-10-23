import express from 'express';
import authRouter from './auth.routes.js';
import vagasRouter from './vagas.routes.js';
import empresasRouter from './empresas.routes.js';
import candidaturasRouter from './candidaturas.routes.js';
import dashboardRouter from './dashboard.routes.js';
import habilidadesRouter from './habilidades.routes.js';
import favoritosRouter from './favoritos.routes.js';
import atividadesRouter from './atividades.routes.js';
import adminRouter from './admin.routes.js';
import adminEmpresasRouter from './empresas.admin.routes.js';
import mensagensRouter from './mensagens.routes.js';
import pushRouter from './push.routes.js';
import empresaManagementRouter from './empresa.management.routes.js';
import usuariosRouter from './usuarios.routes.js'; // Importa o novo router
import { pusherAuth } from './websocket.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const routes = express.Router();

routes.use('/auth', authRouter);
routes.use('/vagas', vagasRouter);
routes.use('/usuarios', usuariosRouter); // Adiciona o novo router
routes.use('/empresas', empresasRouter);
routes.use('/habilidades', habilidadesRouter);
routes.use('/candidaturas', candidaturasRouter);
routes.use('/favoritos', favoritosRouter);
routes.use('/atividades', atividadesRouter);
routes.use('/admin/empresas', adminEmpresasRouter); // Agora lida com GET e POST
routes.use('/admin/dashboard-stats', dashboardRouter); // Movido para consistência
routes.use('/admin', adminRouter); // Rota mais genérica depois
routes.use('/mensagens', mensagensRouter);
routes.use('/push', pushRouter);
routes.use('/empresa', empresaManagementRouter);

// Rota de autenticação para canais privados/presence do Pusher
routes.post('/pusher/auth', authenticateToken, pusherAuth); // Adicionado middleware de autenticação

export default routes;