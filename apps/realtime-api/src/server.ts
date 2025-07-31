import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';

import { DynamoDBService } from './services/dynamodb';
import { EntityUpdateMessage, EntityListMessage } from './types';
import {
  initializeEntities,
  generateRandomValue,
  shouldChangeProperty,
  demoEntities,
} from './demo-data';

// Define WebSocket connection interface
interface WebSocketConnection {
  socket: {
    readyState: number;
    send: (data: string) => void;
    on: (event: string, handler: (data?: unknown) => void) => void;
  };
}

// Store connected WebSocket clients
const clients = new Set<WebSocketConnection>();

// Initialize entities
const entities = initializeEntities();

// Broadcast message to all connected clients
const broadcast = (message: unknown) => {
  const messageStr = JSON.stringify(message);
  clients.forEach(client => {
    if (client.socket.readyState === 1) {
      // WebSocket.OPEN
      client.socket.send(messageStr);
    }
  });
};

// Send initial entity list to new client
const sendEntityList = (client: WebSocketConnection) => {
  const message: EntityListMessage = {
    type: 'entity_list',
    payload: { entities },
  };
  client.socket.send(JSON.stringify(message));
};

// Generate random entity updates
const generateEntityUpdates = (): void => {
  entities.forEach(entity => {
    Object.entries(entity.properties).forEach(([propertyName, property]) => {
      // Find the demo config for this entity and property
      const demoConfig = demoEntities.find(e => e.id === entity.id);
      if (!demoConfig || !demoConfig.properties[propertyName]) return;

      const propConfig = demoConfig.properties[propertyName];

      // Check if this property should change based on frequency
      if (shouldChangeProperty(propConfig.changeFrequency)) {
        const oldValue = property.currentValue;
        const newValue = generateRandomValue(propConfig);

        // Update the entity
        property.currentValue = newValue;
        property.lastChanged = new Date().toISOString();
        entity.lastSeen = new Date().toISOString();
        entity.changesToday++;

        // Add to history (keep last 10 changes)
        property.history.push({
          timestamp: property.lastChanged,
          oldValue,
          newValue,
        });

        if (property.history.length > 10) {
          property.history.shift();
        }

        // Broadcast the update
        const updateMessage: EntityUpdateMessage = {
          type: 'entity_update',
          payload: {
            entityId: entity.id,
            property: propertyName,
            timestamp: property.lastChanged,
            oldValue,
            newValue,
          },
        };

        broadcast(updateMessage);

        console.log(
          `📊 ${entity.name}.${propertyName}: ${oldValue} → ${newValue}`
        );
      }
    });
  });
};

export async function createServer() {
  const fastify = Fastify({
    logger: true,
  });

  // Register CORS
  await fastify.register(cors, {
    origin: true, // Allow all origins in development
  });

  // Register WebSocket support
  await fastify.register(websocket);

  // Initialize DynamoDB service
  const dynamoDBService = new DynamoDBService();

  // WebSocket route
  fastify.get('/ws', { websocket: true }, connection => {
    console.log('🔌 New WebSocket client connected');
    clients.add(connection);

    // Send initial entity list
    sendEntityList(connection);

    // Send connection status
    connection.socket.send(
      JSON.stringify({
        type: 'connection_status',
        payload: { status: 'connected' },
      })
    );

    connection.socket.on('close', () => {
      console.log('🔌 WebSocket client disconnected');
      clients.delete(connection);
    });

    connection.socket.on('error', (error: Error) => {
      console.error('❌ WebSocket error:', error);
      clients.delete(connection);
    });
  });

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

  // Start generating updates every 2 seconds
  setInterval(generateEntityUpdates, 2000);

  return fastify;
}
// test comment
