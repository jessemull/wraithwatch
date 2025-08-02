import * as routes from './routes';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import {
  DynamoDBService,
  EntityManager,
  WebSocketManager,
  AggregatedMetricsService,
} from './services';
import { websocketPlugin } from './plugins';

export async function createServer() {
  const fastify = Fastify({
    logger: true,
  });

  // Register CORS directly...

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

  // Initialize services...

  const dynamoDBService = new DynamoDBService();
  const websocketManager = new WebSocketManager();
  const entityManager = new EntityManager(websocketManager, dynamoDBService);
  const aggregatedMetricsService = new AggregatedMetricsService();

  // Register WebSocket plugin...

  await fastify.register(websocketPlugin, {
    websocketManager,
    entityManager,
  });

  // Register routes...

  await fastify.register(routes.default, {
    dynamoDBService,
    aggregatedMetricsService,
  });

  // Start generating entity updates...

  await entityManager.initializeFromDatabase();

  entityManager.startUpdateGeneration(2000);

  return fastify;
}
