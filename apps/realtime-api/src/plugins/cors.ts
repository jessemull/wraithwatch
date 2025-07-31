import { FastifyPluginAsync } from 'fastify';
import cors from '@fastify/cors';

 // Allow all origins in development...
 
const corsPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(cors, {
    origin: true,
  });
};

export default corsPlugin; 