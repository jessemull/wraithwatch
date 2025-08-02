import healthRoute from './health';
import { FastifyPluginAsync } from 'fastify';
import { RouteOptions } from '../types/routes';
import { ApiResponse } from '../types/api';

const routes: FastifyPluginAsync<RouteOptions> = async (fastify, options) => {
  const { dynamoDBService, aggregatedMetricsService } = options;

  await fastify.register(healthRoute);

  fastify.get('/api/test/data', async (request, reply) => {
    const { limit } = request.query as { limit?: string };

    try {
      const [data, positions] = await Promise.all([
        dynamoDBService.getAllData(limit ? parseInt(limit, 10) : 5),
        dynamoDBService.getAllEntityPositions(),
      ]);

      // Calculate aggregated metrics from the same data...

      const metrics = await aggregatedMetricsService.calculateMetrics(data);

      return {
        success: true,
        data,
        positions,
        metrics,
        count: data.length,
        positionCount: positions.length,
      } as ApiResponse;
    } catch (error) {
      reply.status(500);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse;
    }
  });
};

export default routes;
