import Fastify from 'fastify';
import cors from '@fastify/cors';
import { DynamoDBService } from './services/dynamodb';

export async function createServer() {
  const fastify = Fastify({
    logger: true,
  });

  // Register CORS
  await fastify.register(cors, {
    origin: true, // Allow all origins in development
  });

  // Initialize DynamoDB service
  const dynamoDBService = new DynamoDBService();

  // Health check endpoint
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Test endpoint to see table data
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
      };
    } catch (error) {
      reply.status(500);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

  // Get entity history
  fastify.get('/api/history/entity/:entityId', async (request, reply) => {
    const { entityId } = request.params as { entityId: string };
    const { propertyName, startTime, endTime, limit } = request.query as {
      propertyName?: string;
      startTime?: string;
      endTime?: string;
      limit?: string;
    };

    try {
      const history = await dynamoDBService.getEntityHistory(entityId, {
        propertyName,
        startTime,
        endTime,
        limit: limit ? parseInt(limit, 10) : undefined,
      });

      return {
        success: true,
        data: history,
        count: history.length,
      };
    } catch (error) {
      reply.status(500);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

  // Get property history for a specific entity and property
  fastify.get(
    '/api/history/entity/:entityId/property/:propertyName',
    async (request, reply) => {
      const { entityId, propertyName } = request.params as {
        entityId: string;
        propertyName: string;
      };
      const { startTime, endTime, limit } = request.query as {
        startTime?: string;
        endTime?: string;
        limit?: string;
      };

      try {
        const history = await dynamoDBService.getPropertyHistory(
          entityId,
          propertyName,
          {
            startTime,
            endTime,
            limit: limit ? parseInt(limit, 10) : undefined,
          }
        );

        return {
          success: true,
          data: history,
          count: history.length,
        };
      } catch (error) {
        reply.status(500);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }
  );

  // Get recent changes across all entities
  fastify.get('/api/history/recent', async (request, reply) => {
    const { entityType, limit, hours } = request.query as {
      entityType?: string;
      limit?: string;
      hours?: string;
    };

    try {
      const changes = await dynamoDBService.getRecentChanges({
        entityType,
        limit: limit ? parseInt(limit, 10) : undefined,
        hours: hours ? parseInt(hours, 10) : undefined,
      });

      return {
        success: true,
        data: changes,
        count: changes.length,
      };
    } catch (error) {
      reply.status(500);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

  // Get entity summary
  fastify.get('/api/summary/entity/:entityId', async (request, reply) => {
    const { entityId } = request.params as { entityId: string };

    try {
      const summary = await dynamoDBService.getEntitySummary(entityId);

      return {
        success: true,
        data: summary,
      };
    } catch (error) {
      reply.status(500);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

  return fastify;
}
