import express from 'express';
import cors from 'cors';

// Importa os novos routers
import authRouter from './routes/auth.routes';
import vagasRouter from './routes/vagas.routes';
import empresasRouter from './routes/empresas.routes';
import candidaturasRouter from './routes/candidaturas.routes';
import dashboardRouter from './routes/dashboard.routes';
import habilidadesRouter from './routes/habilidades.routes';
import favoritosRouter from './routes/favoritos.routes';
import atividadesRouter from './routes/atividades.routes';

const app = express();
const port = process.env.PORT || 3000;

// --- Middlewares Globais ---
app.use(cors());
app.use(express.json());

// --- ROTAS ---
app.use('/', authRouter); // Rotas como /login, /api/usuarios, etc.
app.use('/api/vagas', vagasRouter);
app.use('/api/empresas', empresasRouter);
app.use('/api/candidaturas', candidaturasRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/habilidades', habilidadesRouter);
app.use('/api/favoritos', favoritosRouter);
app.use('/api/atividades', atividadesRouter);

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta: ${port}`);
});