import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import routes from './routes/index.ts';
import { errorHandler } from './middlewares/errorHandler.ts';

const app = express();

app.use(cors());
app.use(express.json());

// All API routes will be prefixed with /api
app.use('/api', routes);

// Global error handler middleware (must be last)
app.use(errorHandler);

// Export the app for Vercel
export default app;