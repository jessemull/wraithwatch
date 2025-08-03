import { createServer } from '../server';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import {
  DynamoDBService,
  EntityManager,
  WebSocketManager,
  AggregatedMetricsService,
} from '../services';
import { websocketPlugin } from '../plugins';
import * as routes from '../routes';

jest.mock('fastify');
jest.mock('@fastify/cors');
jest.mock('../services');
jest.mock('../plugins');
jest.mock('../routes');
jest.mock('../utils/logger', () => ({
  createComponentLogger: jest.fn().mockReturnValue({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  }),
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Server', () => {
  let mockFastify: any;
  let mockRegister: jest.Mock;
  let mockListen: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRegister = jest.fn();
    mockListen = jest.fn();
    mockFastify = {
      register: mockRegister,
      listen: mockListen,
      logger: true,
    };

    (Fastify as unknown as jest.Mock).mockReturnValue(mockFastify);

    (DynamoDBService as unknown as jest.Mock).mockImplementation(() => ({
      getAllData: jest.fn(),
      createEntityChange: jest.fn(),
    }));

    (WebSocketManager as unknown as jest.Mock).mockImplementation(() => ({
      addClient: jest.fn(),
      removeClient: jest.fn(),
      broadcast: jest.fn(),
    }));

    (EntityManager as unknown as jest.Mock).mockImplementation(() => ({
      initializeFromDatabase: jest.fn(),
      startUpdateGeneration: jest.fn(),
    }));

    (AggregatedMetricsService as unknown as jest.Mock).mockImplementation(
      () => ({
        getAggregatedMetrics: jest.fn(),
      })
    );

    (websocketPlugin as jest.Mock).mockImplementation(() => ({}));
    (routes.default as jest.Mock).mockImplementation(() => ({}));
  });

  describe('createServer', () => {
    it('creates a Fastify server with logger enabled', async () => {
      await createServer();

      expect(Fastify as unknown as jest.Mock).toHaveBeenCalledWith({
        logger: true,
      });
    });

    it('registers CORS plugin with correct configuration', async () => {
      await createServer();

      expect(mockRegister).toHaveBeenCalledWith(cors, {
        origin: [
          'http://localhost:3000',
          'https://www.wraithwatch-demo.com',
          'https://wraithwatch-demo.com',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: [
          'Content-Type',
          'Authorization',
          'X-Requested-With',
          'Accept',
          'Origin',
          'Cache-Control',
          'X-File-Name',
        ],
        exposedHeaders: ['Content-Type', 'Authorization'],
      });
    });

    it('initializes all required services', async () => {
      await createServer();

      expect(DynamoDBService as unknown as jest.Mock).toHaveBeenCalled();
      expect(WebSocketManager as unknown as jest.Mock).toHaveBeenCalled();
      expect(EntityManager as unknown as jest.Mock).toHaveBeenCalled();
      expect(
        AggregatedMetricsService as unknown as jest.Mock
      ).toHaveBeenCalled();
    });

    it('creates EntityManager with correct dependencies', async () => {
      await createServer();

      expect(EntityManager as unknown as jest.Mock).toHaveBeenCalledWith(
        expect.objectContaining({
          addClient: expect.any(Function),
          removeClient: expect.any(Function),
          broadcast: expect.any(Function),
        }),
        expect.objectContaining({
          getAllData: expect.any(Function),
          createEntityChange: expect.any(Function),
        })
      );
    });

    it('registers websocket plugin with correct options', async () => {
      await createServer();

      expect(mockRegister).toHaveBeenCalledWith(websocketPlugin, {
        websocketManager: expect.objectContaining({
          addClient: expect.any(Function),
          removeClient: expect.any(Function),
          broadcast: expect.any(Function),
        }),
        entityManager: expect.objectContaining({
          initializeFromDatabase: expect.any(Function),
          startUpdateGeneration: expect.any(Function),
        }),
      });
    });

    it('registers routes with correct services', async () => {
      await createServer();

      expect(mockRegister).toHaveBeenCalledWith(routes.default, {
        dynamoDBService: expect.objectContaining({
          getAllData: expect.any(Function),
          createEntityChange: expect.any(Function),
        }),
        aggregatedMetricsService: expect.objectContaining({
          getAggregatedMetrics: expect.any(Function),
        }),
      });
    });

    it('initializes entity manager from database', async () => {
      const mockEntityManager = {
        initializeFromDatabase: jest.fn(),
        startUpdateGeneration: jest.fn(),
      };
      (EntityManager as unknown as jest.Mock).mockReturnValue(
        mockEntityManager
      );

      await createServer();

      expect(mockEntityManager.initializeFromDatabase).toHaveBeenCalled();
    });

    it('starts entity update generation with correct interval', async () => {
      const mockEntityManager = {
        initializeFromDatabase: jest.fn(),
        startUpdateGeneration: jest.fn(),
      };
      (EntityManager as unknown as jest.Mock).mockReturnValue(
        mockEntityManager
      );

      await createServer();

      expect(mockEntityManager.startUpdateGeneration).toHaveBeenCalledWith(
        2000
      );
    });

    it('returns the configured Fastify instance', async () => {
      const result = await createServer();

      expect(result).toBe(mockFastify);
    });

    it('handles service initialization errors gracefully', async () => {
      const mockError = new Error('Service initialization failed');
      (DynamoDBService as unknown as jest.Mock).mockImplementation(() => {
        throw mockError;
      });

      await expect(createServer()).rejects.toThrow(
        'Service initialization failed'
      );
    });

    it('handles plugin registration errors gracefully', async () => {
      mockRegister.mockRejectedValueOnce(
        new Error('Plugin registration failed')
      );

      await expect(createServer()).rejects.toThrow(
        'Plugin registration failed'
      );
    });

    it('handles route registration errors gracefully', async () => {
      mockRegister
        .mockResolvedValueOnce(undefined) // CORS registration
        .mockResolvedValueOnce(undefined) // WebSocket plugin registration
        .mockRejectedValueOnce(new Error('Route registration failed')); // Routes registration

      await expect(createServer()).rejects.toThrow('Route registration failed');
    });
  });

  describe('server configuration', () => {
    it('registers plugins and routes in correct order', async () => {
      await createServer();

      const registerCalls = mockRegister.mock.calls;

      expect(registerCalls[0][0]).toBe(cors);
      expect(registerCalls[1][0]).toBe(websocketPlugin);
      expect(registerCalls[2][0]).toBe(routes.default);
    });

    it('passes correct options to websocket plugin', async () => {
      await createServer();

      const websocketCall = mockRegister.mock.calls.find(
        call => call[0] === websocketPlugin
      );

      expect(websocketCall[1]).toEqual({
        websocketManager: expect.objectContaining({
          addClient: expect.any(Function),
          removeClient: expect.any(Function),
          broadcast: expect.any(Function),
        }),
        entityManager: expect.objectContaining({
          initializeFromDatabase: expect.any(Function),
          startUpdateGeneration: expect.any(Function),
        }),
      });
    });

    it('passes correct options to routes', async () => {
      await createServer();

      const routesCall = mockRegister.mock.calls.find(
        call => call[0] === routes.default
      );

      expect(routesCall[1]).toEqual({
        dynamoDBService: expect.objectContaining({
          getAllData: expect.any(Function),
          createEntityChange: expect.any(Function),
        }),
        aggregatedMetricsService: expect.objectContaining({
          getAggregatedMetrics: expect.any(Function),
        }),
      });
    });
  });
});
