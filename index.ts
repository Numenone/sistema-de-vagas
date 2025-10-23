import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import 'express-async-errors';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const __dirname = path.resolve();
const app = express();

app.options('*', cors()) // enable pre-flight request for all routes
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Todas as rotas da API serão prefixadas com /api
app.use('/api', routes);

// --- Servir Arquivos Estáticos e Rota Catch-all para a SPA ---
// Apenas em ambiente de produção (ex: quando não estiver em desenvolvimento com o Vite)
if (process.env.NODE_ENV === 'production') {
  // Servir arquivos estáticos do build do frontend
  app.use(express.static(path.join(__dirname, 'dist')));

  // Rota Catch-all para a SPA (Single Page Application)
  // Deve vir DEPOIS das rotas da API
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Middleware de tratamento de erros global (deve ser o último)
app.use(errorHandler);

export default app;