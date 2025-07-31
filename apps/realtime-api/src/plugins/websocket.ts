import { FastifyPluginAsync } from 'fastify';
import websocket from '@fastify/websocket';
import { WebSocketManager } from '../services/websocket-manager';
import { EntityManager } from '../services/entity-manager';
import { WebSocketConnection } from '../types/websocket';

export interface WebSocketPluginOptions {
  websocketManager: WebSocketManager;
  entityManager: EntityManager;
}

const websocketPlugin: FastifyPluginAsync<WebSocketPluginOptions> = async (fastify, options) => {
  await fastify.register(websocket);

  fastify.get('/ws', { websocket: true }, (connection: WebSocketConnection) => {
    const { websocketManager, entityManager } = options;
    
    // Add client to manager
    websocketManager.addClient(connection);

    // Send initial entity list
    entityManager.sendEntityList(connection);

    // Send connection status
    entityManager.sendConnectionStatus(connection);

    // Handle client disconnect
    connection.socket.on('close', () => {
      websocketManager.removeClient(connection);
    });

    // Handle WebSocket errors
    connection.socket.on('error', (error: Error) => {
      console.error('❌ WebSocket error:', error);
      websocketManager.removeClient(connection);
    });
  });
};

export default websocketPlugin; 