import * as routes from './routes';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { DynamoDBService, EntityManager, WebSocketManager } from './services';
import { websocketPlugin } from './plugins';

export async function createServer() {
  const fastify = Fastify({
    logger: true,
  });

  // Register CORS directly...

  await fastify.register(cors, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Cache-Control',
      'X-File-Name',
    ],
    exposedHeaders: ['Content-Type', 'Authorization'],
  });

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
