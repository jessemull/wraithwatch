import * as routes from './routes';
import Fastify from 'fastify';
import { DynamoDBService, EntityManager, WebSocketManager } from './services';
import { corsPlugin, websocketPlugin } from './plugins';

export async function createServer() {
  const fastify = Fastify({
    logger: true,
  });

  // Register CORS plugin...

  await fastify.register(corsPlugin);

  // Initialize services...

  const dynamoDBService = new DynamoDBService();
  const websocketManager = new WebSocketManager();
  const entityManager = new EntityManager(websocketManager);

  // Register WebSocket plugin...

  await fastify.register(websocketPlugin, {
    websocketManager,
    entityManager,
  });

  // Register routes...

  await fastify.register(routes.default, {
    dynamoDBService,
  });

  // Start generating entity updates...
  
  entityManager.startUpdateGeneration(2000);

  return fastify;
} 