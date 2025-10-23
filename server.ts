import http from 'http';
import app from './index'; // Importa a configuração do app
import { initializeWebSocket } from './routes/websocket';

const port = process.env.PORT || 3000;

// Cria o servidor HTTP a partir do app Express
const server = http.createServer(app).listen(port, () => {
  console.log(`🚀 Servidor local rodando na porta: ${port}`);
});

// 4. Initialize WebSocket server
initializeWebSocket(server);
