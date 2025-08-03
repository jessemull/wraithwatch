import { FastifyInstance } from 'fastify';
import { WebSocketConnection } from '../../types/websocket';

import websocketPlugin from '../websocket';

describe('WebSocket Plugin', () => {
  let fastify: FastifyInstance;
  let mockWebSocketManager: any;
  let mockEntityManager: any;
  let mockConnection: WebSocketConnection;

  beforeEach(() => {
    mockWebSocketManager = {
      addClient: jest.fn(),
      removeClient: jest.fn(),
    };

    mockEntityManager = {
      sendEntityList: jest.fn(),
      sendConnectionStatus: jest.fn(),
    };

    mockConnection = {
      socket: {
        on: jest.fn(),
        send: jest.fn(),
        close: jest.fn(),
      },
    } as any;

    fastify = {
      register: jest.fn(),
      get: jest.fn(),
    } as any;
  });

  it('should register websocket plugin', async () => {
    await websocketPlugin(fastify, {
      websocketManager: mockWebSocketManager,
      entityManager: mockEntityManager,
    });

    expect(fastify.register).toHaveBeenCalled();
  });

  it('should register GET route with websocket handler', async () => {
    await websocketPlugin(fastify, {
      websocketManager: mockWebSocketManager,
      entityManager: mockEntityManager,
    });

    expect(fastify.get).toHaveBeenCalledWith(
      expect.any(String),
      { websocket: true },
      expect.any(Function)
    );
  });

  it('should add client to websocket manager on connection', async () => {
    await websocketPlugin(fastify, {
      websocketManager: mockWebSocketManager,
      entityManager: mockEntityManager,
    });

    const routeHandler = (fastify.get as jest.Mock).mock.calls[0][2];
    routeHandler(mockConnection);

    expect(mockWebSocketManager.addClient).toHaveBeenCalledWith(mockConnection);
  });

  it('should send entity list on connection', async () => {
    await websocketPlugin(fastify, {
      websocketManager: mockWebSocketManager,
      entityManager: mockEntityManager,
    });

    const routeHandler = (fastify.get as jest.Mock).mock.calls[0][2];
    routeHandler(mockConnection);

    expect(mockEntityManager.sendEntityList).toHaveBeenCalledWith(
      mockConnection
    );
  });

  it('should send connection status on connection', async () => {
    await websocketPlugin(fastify, {
      websocketManager: mockWebSocketManager,
      entityManager: mockEntityManager,
    });

    const routeHandler = (fastify.get as jest.Mock).mock.calls[0][2];
    routeHandler(mockConnection);

    expect(mockEntityManager.sendConnectionStatus).toHaveBeenCalledWith(
      mockConnection
    );
  });

  it('should remove client on socket close', async () => {
    await websocketPlugin(fastify, {
      websocketManager: mockWebSocketManager,
      entityManager: mockEntityManager,
    });

    const routeHandler = (fastify.get as jest.Mock).mock.calls[0][2];
    routeHandler(mockConnection);

    const closeHandler = (
      mockConnection.socket.on as jest.Mock
    ).mock.calls.find((call: any) => call[0] === 'close')[1];

    closeHandler();

    expect(mockWebSocketManager.removeClient).toHaveBeenCalledWith(
      mockConnection
    );
  });

  it('should remove client on socket error', async () => {
    await websocketPlugin(fastify, {
      websocketManager: mockWebSocketManager,
      entityManager: mockEntityManager,
    });

    const routeHandler = (fastify.get as jest.Mock).mock.calls[0][2];
    routeHandler(mockConnection);

    const errorHandler = (
      mockConnection.socket.on as jest.Mock
    ).mock.calls.find((call: any) => call[0] === 'error')[1];

    const testError = new Error('Test error');
    errorHandler(testError);

    expect(mockWebSocketManager.removeClient).toHaveBeenCalledWith(
      mockConnection
    );
  });

  it('should handle multiple connections independently', async () => {
    await websocketPlugin(fastify, {
      websocketManager: mockWebSocketManager,
      entityManager: mockEntityManager,
    });

    const routeHandler = (fastify.get as jest.Mock).mock.calls[0][2];
    const mockConnection2 = {
      socket: {
        on: jest.fn(),
        send: jest.fn(),
        close: jest.fn(),
      },
    } as any;

    routeHandler(mockConnection);
    routeHandler(mockConnection2);

    expect(mockWebSocketManager.addClient).toHaveBeenCalledWith(mockConnection);
    expect(mockWebSocketManager.addClient).toHaveBeenCalledWith(
      mockConnection2
    );
    expect(mockEntityManager.sendEntityList).toHaveBeenCalledWith(
      mockConnection
    );
    expect(mockEntityManager.sendEntityList).toHaveBeenCalledWith(
      mockConnection2
    );
  });
});
