import { Request, Response } from 'express';
import * as habilidadesService from '../services/habilidades.service.js';

export async function getAllHabilidades(req: Request, res: Response) {
  const habilidades = await habilidadesService.getAll();
  res.json(habilidades);
}