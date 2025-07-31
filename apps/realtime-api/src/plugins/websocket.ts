import websocket from '@fastify/websocket';
import { FastifyPluginAsync } from 'fastify';
import { WEBSOCKET_PATH } from '../constants';
import { WebSocketConnection } from '../types/websocket';
import { WebSocketPluginOptions } from '../types/plugins';
import { createComponentLogger } from '../utils/logger';

const logger = createComponentLogger('websocket-plugin');

const websocketPlugin: FastifyPluginAsync<WebSocketPluginOptions> = async (fastify, options) => {
  await fastify.register(websocket);

  fastify.get(WEBSOCKET_PATH, { websocket: true }, (connection: WebSocketConnection) => {
    const { websocketManager, entityManager } = options;
    
    // Add client to manager...

    websocketManager.addClient(connection);

    // Send initial entity list...

    entityManager.sendEntityList(connection);

    // Send connection status...

    entityManager.sendConnectionStatus(connection);

    // Handle client disconnect...

    connection.socket.on('close', () => {
      websocketManager.removeClient(connection);
    });

    // Handle WebSocket errors...
    
    connection.socket.on('error', (error: unknown) => {
      logger.error({ error }, 'WebSocket error');
      websocketManager.removeClient(connection);
    });
  });
};

export default websocketPlugin; 