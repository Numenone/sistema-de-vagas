import { Request, Response } from 'express';
import * as atividadesService from '../services/atividades.service.js';

export async function getAtividadesRecentes(req: Request, res: Response) {
  const atividades = await atividadesService.getAtividadesRecentes();
  res.json(atividades);
}