import { Request, Response } from 'express';
import { saveSubscription, isPushAvailable } from '../services/push.service.js';

export function getVapidKey(req: Request, res: Response) {
  if (!isPushAvailable()) {
    return res.status(503).json({ error: 'Push notifications are not configured on the server.' });
  }
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
}

export async function subscribe(req: Request, res: Response) {
  const subscription = req.body;
  const usuario = req.usuario!;

  await saveSubscription(subscription, usuario.id);

  res.status(201).json({ success: true });
}