import { Request, Response } from 'express';
import * as pushService from '../services/push.service';
import { isPushAvailable } from '../src/utils/push';

export function getVapidKey(req: Request, res: Response) {
  if (!isPushAvailable()) {
    return res.status(503).json({ error: 'Push notifications are not configured on the server.' });
  }
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
}

export async function subscribe(req: Request, res: Response) {
  const subscription = req.body;
  const usuario = req.usuario!;

  await pushService.saveSubscription(subscription, usuario.id);

  res.status(201).json({ success: true });
}