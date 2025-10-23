import { Request, Response } from 'express';
import * as favoritosService from '../services/favoritos.service.js';

export async function getFavoritos(req: Request, res: Response) {
  const favoritos = await favoritosService.getFavoritosByUsuario(req.usuario!.id);
  res.json(favoritos);
}

export async function addFavorito(req: Request, res: Response) {
  await favoritosService.addFavorito(req.usuario!.id, Number(req.params.vagaId));
  res.status(200).json({ message: 'Vaga favoritada com sucesso' });
}

export async function removeFavorito(req: Request, res: Response) {
  await favoritosService.removeFavorito(req.usuario!.id, Number(req.params.vagaId));
  res.status(200).json({ message: 'Vaga removida dos favoritos' });
}