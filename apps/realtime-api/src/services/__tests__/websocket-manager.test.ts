import { WebSocketManager } from '../websocket-manager';
import { WebSocketConnection } from '../../types/websocket';

describe('WebSocketManager', () => {
  let manager: WebSocketManager;
  let mockClient1: WebSocketConnection;
  let mockClient2: WebSocketConnection;

  beforeEach(() => {
    manager = new WebSocketManager();
    mockClient1 = {
      socket: {
        readyState: 1,
        send: jest.fn(),
      } as any,
    };
    mockClient2 = {
      socket: {
        readyState: 1,
        send: jest.fn(),
      } as any,
    };
  });

  it('should start with zero clients', () => {
    expect(manager.getClientCount()).toBe(0);
    expect(manager.getClients().size).toBe(0);
  });

  it('should add client and update count', () => {
    manager.addClient(mockClient1);

    expect(manager.getClientCount()).toBe(1);
    expect(manager.getClients().has(mockClient1)).toBe(true);
  });

  it('should add multiple clients', () => {
    manager.addClient(mockClient1);
    manager.addClient(mockClient2);

    expect(manager.getClientCount()).toBe(2);
    expect(manager.getClients().has(mockClient1)).toBe(true);
    expect(manager.getClients().has(mockClient2)).toBe(true);
  });

  it('should remove client and update count', () => {
    manager.addClient(mockClient1);
    manager.addClient(mockClient2);
    manager.removeClient(mockClient1);

    expect(manager.getClientCount()).toBe(1);
    expect(manager.getClients().has(mockClient1)).toBe(false);
    expect(manager.getClients().has(mockClient2)).toBe(true);
  });

  it('should remove non-existent client without error', () => {
    manager.removeClient(mockClient1);

    expect(manager.getClientCount()).toBe(0);
  });

  it('should broadcast message to all connected clients', () => {
    manager.addClient(mockClient1);
    manager.addClient(mockClient2);

    const message = { type: 'test', data: 'hello' };
    manager.broadcast(message);

    expect(mockClient1.socket.send).toHaveBeenCalledWith(
      JSON.stringify(message)
    );
    expect(mockClient2.socket.send).toHaveBeenCalledWith(
      JSON.stringify(message)
    );
  });

  it('should not send to disconnected clients', () => {
    mockClient1.socket.readyState = 3;
    manager.addClient(mockClient1);
    manager.addClient(mockClient2);

    const message = { type: 'test', data: 'hello' };
    manager.broadcast(message);

    expect(mockClient1.socket.send).not.toHaveBeenCalled();
    expect(mockClient2.socket.send).toHaveBeenCalledWith(
      JSON.stringify(message)
    );
  });

  it('should handle empty client list during broadcast', () => {
    const message = { type: 'test', data: 'hello' };

    expect(() => manager.broadcast(message)).not.toThrow();
  });

  it('should handle complex message objects', () => {
    manager.addClient(mockClient1);

    const complexMessage = {
      type: 'update',
      data: {
        entities: [{ id: '1', name: 'test' }],
        timestamp: new Date().toISOString(),
        metadata: {
          source: 'websocket',
          version: '1.0.0',
        },
      },
    };

    manager.broadcast(complexMessage);

    expect(mockClient1.socket.send).toHaveBeenCalledWith(
      JSON.stringify(complexMessage)
    );
  });

  it('should handle string messages', () => {
    manager.addClient(mockClient1);

    const message = 'simple string message';
    manager.broadcast(message);

    expect(mockClient1.socket.send).toHaveBeenCalledWith(
      JSON.stringify(message)
    );
  });

  it('should handle null and undefined messages', () => {
    manager.addClient(mockClient1);

    manager.broadcast(null);
    expect(mockClient1.socket.send).toHaveBeenCalledWith('null');

    manager.broadcast(undefined);
    expect(mockClient1.socket.send).toHaveBeenCalledWith(undefined);
  });

  it('should return correct client count after multiple operations', () => {
    expect(manager.getClientCount()).toBe(0);

    manager.addClient(mockClient1);
    expect(manager.getClientCount()).toBe(1);

    manager.addClient(mockClient2);
    expect(manager.getClientCount()).toBe(2);

    manager.removeClient(mockClient1);
    expect(manager.getClientCount()).toBe(1);

    manager.removeClient(mockClient2);
    expect(manager.getClientCount()).toBe(0);
  });

  it('should return clients set reference', () => {
    const clients = manager.getClients();

    expect(clients).toBeInstanceOf(Set);
    expect(clients.size).toBe(0);
  });
});
