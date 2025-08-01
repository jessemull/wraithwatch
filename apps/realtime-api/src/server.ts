import * as routes from './routes';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { DynamoDBService, EntityManager, WebSocketManager } from './services';
import { websocketPlugin } from './plugins';

export async function createServer() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: [
      'http://localhost:3000',
      'https://www.wraithwatch-demo.com',
      'https://wraithwatch-demo.com',
    ],
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

  const dynamoDBService = new DynamoDBService();
  const websocketManager = new WebSocketManager();
  const entityManager = new EntityManager(websocketManager, dynamoDBService);

  await fastify.register(websocketPlugin, {
    websocketManager,
    entityManager,
  });

  await fastify.register(routes.default, {
    dynamoDBService,
  });

  await entityManager.initializeFromDatabase();
  entityManager.startUpdateGeneration(2000);

  return fastify;
}
