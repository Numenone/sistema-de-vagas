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
  'https://sistema-de-vagas-nine.vercel.app', // Nova URL de preview do frontend
  'https://sistema-de-vagas-nine.vercel.app', // URL de preview antiga
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

// Middleware de tratamento de erros global (deve ser o último)
app.use(errorHandler);

export default app;