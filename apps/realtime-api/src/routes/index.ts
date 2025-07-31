import { FastifyPluginAsync } from 'fastify';
import healthRoute from './health';
import historyRoute from './history';
import summaryRoute from './summary';
import { RouteOptions } from '../types/routes';

const routes: FastifyPluginAsync<RouteOptions> = async (fastify, options) => {
  // Register all routes
  await fastify.register(healthRoute);
  await fastify.register(historyRoute, options);
  await fastify.register(summaryRoute, options);
};

export default routes; 