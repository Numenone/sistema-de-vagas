import { Request, Response } from 'express';
import * as atividadesService from '../services/atividades.service';

export async function getAtividadesRecentes(req: Request, res: Response) {
  const atividades = await atividadesService.getAtividadesRecentes();
  res.json(atividades);
}