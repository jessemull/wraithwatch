import Fastify from 'fastify';
import { DynamoDBService } from './services/dynamodb';
import { WebSocketManager } from './services/websocket-manager';
import { EntityManager } from './services/entity-manager';
import corsPlugin from './plugins/cors';
import websocketPlugin from './plugins/websocket';
import routes from './routes';

export async function createServer() {
  const fastify = Fastify({
    logger: true,
  });

  // Register CORS plugin
  await fastify.register(corsPlugin);

  // Initialize services
  const dynamoDBService = new DynamoDBService();
  const websocketManager = new WebSocketManager();
  const entityManager = new EntityManager(websocketManager);

  // Register WebSocket plugin
  await fastify.register(websocketPlugin, {
    websocketManager,
    entityManager,
  });

  // Register routes
  await fastify.register(routes, {
    dynamoDBService,
  });

  // Start generating entity updates
  entityManager.startUpdateGeneration(2000);

  return fastify;
} 