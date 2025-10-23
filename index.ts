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

// All API routes will be prefixed with /api
app.use('/api', routes);

// --- Servir Arquivos Estáticos do Frontend ---
// Esta rota deve vir ANTES da rota catch-all para servir assets como .js, .css, .svg, etc.
app.use(express.static(path.join(__dirname, 'dist')));

// --- Rota Catch-all para Single Page Application (SPA) ---
// Para qualquer outra rota GET que não seja uma API, sirva o index.html.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
// Global error handler middleware (must be last)
app.use(errorHandler);

// Export the app for Vercel's serverless environment
export default app;