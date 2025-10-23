import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import 'express-async-errors';
import routes from './routes/index';
import { errorHandler } from './middlewares/errorHandler';

const __dirname = path.resolve();
const app = express();

app.use(cors());
app.use(express.json());

// Todas as rotas da API serão prefixadas com /api
app.use('/api', routes);

// --- Servir Arquivos Estáticos do Frontend em Produção ---
app.use(express.static(path.join(__dirname, 'dist')));

// --- Rota Catch-all para a SPA (Single Page Application) ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Middleware de tratamento de erros global (deve ser o último)
app.use(errorHandler);

export default app; // Exporta o app para a Vercel