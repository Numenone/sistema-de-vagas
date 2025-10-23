// This file extends the Express Request interface to include a custom 'usuario' property.
import { Usuario } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      usuario?: Usuario;
    }
  }
}