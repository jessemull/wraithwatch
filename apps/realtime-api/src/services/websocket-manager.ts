import { WebSocketConnection } from '../types/websocket';

export class WebSocketManager {
  private clients = new Set<WebSocketConnection>();

  addClient(client: WebSocketConnection): void {
    this.clients.add(client);
    console.log('New WebSocket client connected');
  }

  removeClient(client: WebSocketConnection): void {
    this.clients.delete(client);
    console.log('WebSocket client disconnected');
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