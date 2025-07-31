import { ApiResponse, HistoryQuery, RecentChangesQuery } from '../types/api';
import { FastifyPluginAsync } from 'fastify';
import { HistoryRouteOptions } from '../types/routes';

const historyRoute: FastifyPluginAsync<HistoryRouteOptions> = async (fastify, options) => {
  const { dynamoDBService } = options;

  // Test endpoint to see table data...

  fastify.get('/api/test/data', async (request, reply) => {
    const { limit } = request.query as { limit?: string };

    try {
      const data = await dynamoDBService.getAllData(
        limit ? parseInt(limit, 10) : 5
      );
      return {
        success: true,
        data,
        count: data.length,
      } as ApiResponse;
    } catch (error) {
      reply.status(500);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse;
    }
  });

  // Get entity history...

  fastify.get('/api/history/entity/:entityId', async (request, reply) => {
    const { entityId } = request.params as { entityId: string };
    const { propertyName, startTime, endTime, limit } = request.query as HistoryQuery;

    try {
      const history = await dynamoDBService.getEntityHistory(entityId, {
        propertyName,
        startTime,
        endTime,
        limit: limit ? parseInt(limit.toString(), 10) : undefined,
      });

      return {
        success: true,
        data: history,
        count: history.length,
      } as ApiResponse;
    } catch (error) {
      reply.status(500);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse;
    }
  });

  // Get property history for a specific entity and property...

  fastify.get(
    '/api/history/entity/:entityId/property/:propertyName',
    async (request, reply) => {
      const { entityId, propertyName } = request.params as {
        entityId: string;
        propertyName: string;
      };
      const { startTime, endTime, limit } = request.query as HistoryQuery;

      try {
        const history = await dynamoDBService.getPropertyHistory(
          entityId,
          propertyName,
          {
            startTime,
            endTime,
            limit: limit ? parseInt(limit.toString(), 10) : undefined,
          }
        );

        return {
          success: true,
          data: history,
          count: history.length,
        } as ApiResponse;
      } catch (error) {
        reply.status(500);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        } as ApiResponse;
      }
    }
  );

  // Get recent changes across all entities...

  fastify.get('/api/history/recent', async (request, reply) => {
    const { entityType, limit, hours } = request.query as RecentChangesQuery;

    try {
      const changes = await dynamoDBService.getRecentChanges({
        entityType,
        limit: limit ? parseInt(limit.toString(), 10) : undefined,
        hours: hours ? parseInt(hours.toString(), 10) : undefined,
      });

      return {
        success: true,
        data: changes,
        count: changes.length,
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

export default historyRoute;