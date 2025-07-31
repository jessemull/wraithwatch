import { FastifyPluginAsync } from 'fastify';
import { DynamoDBService } from '../services/dynamodb';
import healthRoute from './health';
import historyRoute from './history';
import summaryRoute from './summary';

export interface RouteOptions {
  dynamoDBService: DynamoDBService;
}

const routes: FastifyPluginAsync<RouteOptions> = async (fastify, options) => {
  // Register all routes
  await fastify.register(healthRoute);
  await fastify.register(historyRoute, options);
  await fastify.register(summaryRoute, options);
};

export default routes; 