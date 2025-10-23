import Pusher from 'pusher';
import { Server } from 'http';
import { Request, Response } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export function initializeWebSocket(server: Server) {
  console.log('🚀 Pusher service configured. WebSocket handling is now managed by Pusher.');
}

export async function pusherAuth(req: Request, res: Response) {
  // O authenticateToken já validou o usuário e o anexou a req.usuario
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const user = req.usuario!;

  const presenceData = {
    user_id: user.id.toString(),
    user_info: {
      nome: user.nome,
    },
  };

  const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
  res.send(authResponse);
}