import { DEFAULT_PORT, DEFAULT_HOST } from './constants';
import { createServer } from './server';
import { logger } from './utils/logger';

const PORT = process.env.PORT || DEFAULT_PORT;
const HOST = process.env.HOST || DEFAULT_HOST;

async function startServer() {
  try {
    const fastify = await createServer();
    await fastify.listen({ port: Number(PORT), host: HOST });

    logger.info({ port: PORT, host: HOST }, 'Server starting');
    logger.info('Fastify server ready with WebSocket and REST API');
    logger.info('REST API endpoints:');
    logger.info('  GET /health');
    logger.info('  GET /api/history/entity/:entityId');
    logger.info('  GET /api/history/entity/:entityId/property/:propertyName');
    logger.info('  GET /api/history/recent');
    logger.info('  GET /api/summary/entity/:entityId');
    logger.info('WebSocket endpoint:');
    logger.info({ endpoint: `ws://${HOST}:${PORT}/ws` }, 'WebSocket ready');
    logger.info({ interval: '2 seconds' }, 'Generating entity updates');
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
}

startServer();
