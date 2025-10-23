import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import 'express-async-errors';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const __dirname = path.resolve();
const app = express();

// --- Configuração de CORS ---
// Lista de domínios permitidos a fazer requisições para a API.
const allowedOrigins = [
  'https://sistema-de-vagas-5hgrd9jei-numenones-projects.vercel.app', // Sua URL de produção do frontend
  process.env.FRONTEND_URL, // URL do frontend em desenvolvimento (ex: http://localhost:5173)
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Permite requisições da lista de permitidos e requisições sem 'origin' (como Postman ou apps mobile)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// Habilita o CORS com as opções configuradas para todas as rotas.
app.use(cors(corsOptions));
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