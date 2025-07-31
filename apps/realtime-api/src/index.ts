import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { EntityUpdateMessage, EntityListMessage } from './types';
import {
  initializeEntities,
  generateRandomValue,
  shouldChangeProperty,
  demoEntities,
} from './demo-data';
import { createServer as createFastifyServer } from './server';

const PORT = process.env.PORT || 3001;
const httpServer = createServer();
const wss = new WebSocketServer({ server: httpServer });

console.log(`🚀 WebSocket server starting on port ${PORT}`);

// Store connected clients
const clients = new Set<WebSocket>();

// Initialize entities
const entities = initializeEntities();

// Broadcast message to all connected clients
const broadcast = (message: unknown) => {
  const messageStr = JSON.stringify(message);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
};

// Send initial entity list to new client
const sendEntityList = (client: WebSocket) => {
  const message: EntityListMessage = {
    type: 'entity_list',
    payload: { entities },
  };
  client.send(JSON.stringify(message));
};

// Generate random entity updates
const generateEntityUpdates = () => {
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

// WebSocket connection handler
wss.on('connection', (ws: WebSocket) => {
  console.log('🔌 New client connected');
  clients.add(ws);

  // Send initial entity list
  sendEntityList(ws);

  // Send connection status
  ws.send(
    JSON.stringify({
      type: 'connection_status',
      payload: { status: 'connected' },
    })
  );

  ws.on('close', () => {
    console.log('🔌 Client disconnected');
    clients.delete(ws);
  });

  ws.on('error', error => {
    console.error('❌ WebSocket error:', error);
    clients.delete(ws);
  });
});

// Start the HTTP server
httpServer.listen(PORT, async () => {
  console.log(`🚀 Server starting on port ${PORT}`);

  try {
    // Start Fastify server
    const fastify = await createFastifyServer();
    await fastify.listen({ port: 3002, host: '0.0.0.0' });
    console.log('✅ Fastify REST API ready on port 3002');
    console.log('📡 REST API endpoints:');
    console.log('  GET /health');
    console.log('  GET /api/history/entity/:entityId');
    console.log('  GET /api/history/entity/:entityId/property/:propertyName');
    console.log('  GET /api/history/recent');
    console.log('  GET /api/summary/entity/:entityId');
  } catch (err) {
    console.error('❌ Failed to start Fastify server:', err);
    process.exit(1);
  }
});

// Start generating updates every 2 seconds
setInterval(generateEntityUpdates, 2000);

console.log('✅ WebSocket server ready');
console.log(`📡 WebSocket clients can connect to: ws://localhost:${PORT}`);
console.log('🔄 Generating entity updates every 2 seconds...');
