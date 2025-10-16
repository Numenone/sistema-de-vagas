import express from 'express';
import cors from 'cors';
import 'express-async-errors'; // Import para capturar erros em rotas async
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// A Vercel gerencia o servidor, então apenas exportamos o app.
export default app;