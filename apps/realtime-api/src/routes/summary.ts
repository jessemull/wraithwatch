import { ApiResponse } from '../types/api';
import { FastifyPluginAsync } from 'fastify';
import { SummaryRouteOptions } from '../types/routes';

const summaryRoute: FastifyPluginAsync<SummaryRouteOptions> = async (
  fastify,
  options
) => {
  const { dynamoDBService } = options;

  // Get entity summary...

  fastify.get('/api/summary/entity/:entityId', async (request, reply) => {
    const { entityId } = request.params as { entityId: string };

    try {
      const summary = await dynamoDBService.getEntitySummary(entityId);

      return {
        success: true,
        data: summary,
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

export default summaryRoute;
