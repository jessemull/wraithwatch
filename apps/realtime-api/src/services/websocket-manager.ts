import { WebSocketConnection } from '../types/websocket';
import { createComponentLogger } from '../utils/logger';

const logger = createComponentLogger('websocket-manager');

export class WebSocketManager {
  private clients = new Set<WebSocketConnection>();

  addClient(client: WebSocketConnection): void {
    this.clients.add(client);
    logger.info({ clientCount: this.clients.size }, 'New WebSocket client connected');
  }

  removeClient(client: WebSocketConnection): void {
    this.clients.delete(client);
    logger.info({ clientCount: this.clients.size }, 'WebSocket client disconnected');
  }

  broadcast(message: unknown): void {
    const messageStr = JSON.stringify(message);
    this.clients.forEach(client => {
      if (client.socket.readyState === 1) {
        client.socket.send(messageStr);
      }
    });
  }

  getClientCount(): number {
    return this.clients.size;
  }

  getClients(): Set<WebSocketConnection> {
    return this.clients;
  }
} 