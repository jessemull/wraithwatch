import { createServer } from './server';

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    const fastify = await createServer();
    await fastify.listen({ port: Number(PORT), host: '0.0.0.0' });

    console.log(`Server starting on port ${PORT}`);
    console.log('Fastify server ready with WebSocket and REST API');
    console.log('REST API endpoints:');
    console.log('  GET /health');
    console.log('  GET /api/history/entity/:entityId');
    console.log('  GET /api/history/entity/:entityId/property/:propertyName');
    console.log('  GET /api/history/recent');
    console.log('  GET /api/summary/entity/:entityId');
    console.log('WebSocket endpoint:');
    console.log(`  ws://localhost:${PORT}/ws`);
    console.log('Generating entity updates every 2 seconds...');
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
