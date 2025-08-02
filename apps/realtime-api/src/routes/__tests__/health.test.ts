import { FastifyInstance } from 'fastify';
import healthRoute from '../health';

describe('Health Route', () => {
  let fastify: FastifyInstance;

  beforeEach(() => {
    fastify = {
      get: jest.fn(),
    } as any;
  });

  it('should register health route', async () => {
    await healthRoute(fastify, {});

    expect(fastify.get).toHaveBeenCalledWith('/health', expect.any(Function));
  });

  it('should return health status', async () => {
    await healthRoute(fastify, {});

    const routeHandler = (fastify.get as jest.Mock).mock.calls[0][1];
    const result = await routeHandler();

    expect(result).toHaveProperty('status', 'ok');
    expect(result).toHaveProperty('timestamp');
    expect(typeof result.timestamp).toBe('string');
    expect(new Date(result.timestamp).getTime()).toBeGreaterThan(0);
  });

  it('should return valid ISO timestamp', async () => {
    await healthRoute(fastify, {});

    const routeHandler = (fastify.get as jest.Mock).mock.calls[0][1];
    const result = await routeHandler();

    const timestamp = new Date(result.timestamp);
    expect(timestamp.toISOString()).toBe(result.timestamp);
  });

  it('should always return ok status', async () => {
    await healthRoute(fastify, {});

    const routeHandler = (fastify.get as jest.Mock).mock.calls[0][1];
    const result1 = await routeHandler();
    const result2 = await routeHandler();

    expect(result1.status).toBe('ok');
    expect(result2.status).toBe('ok');
  });
}); 