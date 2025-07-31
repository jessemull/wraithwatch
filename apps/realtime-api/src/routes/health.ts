import { FastifyPluginAsync } from 'fastify';
import { HealthResponse } from '../types/api';

const healthRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/health', async (): Promise<HealthResponse> => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });
};

export default healthRoute; 