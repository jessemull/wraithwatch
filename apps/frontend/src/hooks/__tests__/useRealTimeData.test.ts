import { renderHook, waitFor, act } from '@testing-library/react';
import { useRealTimeData } from '../useRealTimeData';

global.fetch = jest.fn();
global.WebSocket = jest.fn(() => ({
  close: jest.fn(),
  send: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  onopen: null,
  onclose: null,
  onerror: null,
  onmessage: null,
  readyState: 1,
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
  url: '',
  protocol: '',
  extensions: '',
  bufferedAmount: 0,
  binaryType: 'blob',
})) as any;
(global.WebSocket as any).CONNECTING = 0;
(global.WebSocket as any).OPEN = 1;
(global.WebSocket as any).CLOSING = 2;
(global.WebSocket as any).CLOSED = 3;
jest.mock('../../config', () => ({
  config: {
    api: {
      baseUrl: 'http://localhost:3000',
    },
    websocket: {
      url: 'ws://localhost:3000/ws',
    },
  },
}));
jest.mock('../../constants', () => ({
  WEBSOCKET_CONNECTION_STATUS: {
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
  },
}));
jest.mock('../../util/entity', () => ({
  updateEntityInList: jest.fn((entityId, entities, updater) => {
    return entities.map((entity: { id: string }) =>
      entity.id === entityId ? updater(entity) : entity
    );
  }),
  updateEntityProperty: jest.fn(
    (entity, newValue, oldValue, property, timestamp) => {
      return {
        ...entity,
        properties: {
          ...entity.properties,
          [property]: {
            name: property,
            currentValue: newValue,
            lastChanged: timestamp,
            history: [
              {
                timestamp,
                oldValue,
                newValue,
              },
            ],
          },
        },
        lastSeen: timestamp,
      };
    }
  ),
}));
jest.mock('../../util/websocket', () => ({
  isEntityListMessage: jest.fn(message => message.type === 'entity_list'),
  isEntityUpdateMessage: jest.fn(message => message.type === 'entity_update'),
  isConnectionStatusMessage: jest.fn(
    message => message.type === 'connection_status'
  ),
}));

describe('useRealTimeData', () => {
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    (global.WebSocket as unknown as jest.Mock).mockClear();
  });

  afterAll(() => {
    (console.warn as jest.Mock).mockRestore();
    (console.error as jest.Mock).mockRestore();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useRealTimeData());
    expect(result.current.entities).toEqual([]);
    expect(result.current.changes).toEqual([]);
    expect(result.current.positions).toEqual([]);
    expect(result.current.metrics).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.isConnected).toBe(false);
    expect(result.current.lastUpdate).toBeNull();
  });

  it('fetches initial data successfully', async () => {
    const mockData = [
      {
        entity_id: 'entity-1',
        entity_type: 'System',
        property_name: 'cpu_usage',
        value: 75,
        timestamp: '2023-01-01T12:00:00Z',
      },
    ];
    const mockResponse = {
      success: true,
      data: mockData,
      positions: [{ entityId: 'entity-1', x: 0, y: 0, z: 0 }],
      metrics: { activeThreats: 5 },
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });
    const { result } = renderHook(() => useRealTimeData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.entities).toHaveLength(1);
    expect(result.current.entities[0].id).toBe('entity-1');
    expect(result.current.entities[0].type).toBe('System');
    expect(result.current.changes).toEqual(mockData);
    expect(result.current.positions).toEqual(mockResponse.positions);
    expect(result.current.metrics).toEqual(mockResponse.metrics);
    expect(result.current.error).toBeNull();
  });

  it('handles API error during initial data fetch', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );
    const { result } = renderHook(() => useRealTimeData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe('Network error');
    expect(result.current.entities).toEqual([]);
  });

  it('handles invalid API response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false }),
    });
    const { result } = renderHook(() => useRealTimeData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe('Invalid response from API');
  });

  it('handles HTTP error response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });
    const { result } = renderHook(() => useRealTimeData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe('HTTP 500: Internal Server Error');
  });

  it('handles non-Error exceptions', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce('String error');
    const { result } = renderHook(() => useRealTimeData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe('Failed to load data');
  });

  it('connects to WebSocket after initial data load', async () => {
    const mockData = { success: true, data: [] };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });
    const mockWebSocket = {
      close: jest.fn(),
      send: jest.fn(),
      onopen: null,
      onclose: null,
      onerror: null,
      onmessage: null,
    };
    (global.WebSocket as unknown as jest.Mock).mockImplementation(
      () => mockWebSocket
    );
    const { result } = renderHook(() => useRealTimeData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(global.WebSocket).toHaveBeenCalledWith('ws://localhost:3000/ws');
  });

  it('handles WebSocket connection status messages', async () => {
    const mockData = { success: true, data: [] };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });
    const mockWebSocket = {
      close: jest.fn(),
      send: jest.fn(),
      onopen: null,
      onclose: null,
      onerror: null,
      onmessage: null,
    };
    (global.WebSocket as unknown as jest.Mock).mockImplementation(
      () => mockWebSocket
    );
    const { result } = renderHook(() => useRealTimeData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    mockWebSocket.onopen?.();
    mockWebSocket.onclose?.();
    expect(result.current.isConnected).toBe(false);
  });

  it('handles WebSocket error events', async () => {
    const mockData = { success: true, data: [] };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });
    const mockWebSocket = {
      close: jest.fn(),
      send: jest.fn(),
      onopen: null,
      onclose: null,
      onerror: null,
      onmessage: null,
    };
    (global.WebSocket as unknown as jest.Mock).mockImplementation(
      () => mockWebSocket
    );
    const { result } = renderHook(() => useRealTimeData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    mockWebSocket.onerror?.(new Event('error'));
    expect(result.current.isConnected).toBe(false);
  });

  it('handles WebSocket message parsing errors', async () => {
    const mockData = { success: true, data: [] };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });
    const mockWebSocket = {
      close: jest.fn(),
      send: jest.fn(),
      onopen: null,
      onclose: null,
      onerror: null,
      onmessage: null,
    };
    (global.WebSocket as unknown as jest.Mock).mockImplementation(
      () => mockWebSocket
    );
    const { result } = renderHook(() => useRealTimeData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    mockWebSocket.onmessage?.({ data: 'invalid json' } as MessageEvent);
    expect(console.error).toHaveBeenCalledWith(
      'Error parsing WebSocket message:',
      expect.any(Error)
    );
  });

  it('handles entity list messages', async () => {
    const mockData = { success: true, data: [] };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });
    const mockWebSocket = {
      close: jest.fn(),
      send: jest.fn(),
      onopen: null,
      onclose: null,
      onerror: null,
      onmessage: null,
    };
    (global.WebSocket as unknown as jest.Mock).mockImplementation(
      () => mockWebSocket
    );
    const { result } = renderHook(() => useRealTimeData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    const entityListMessage = {
      type: 'entity_list',
      payload: {
        entities: [
          {
            id: 'entity-1',
            name: 'Test Entity',
            type: 'System',
            properties: {},
            lastSeen: '2023-01-01T12:00:00Z',
            changesToday: 0,
          },
        ],
      },
    };
    mockWebSocket.onmessage?.({
      data: JSON.stringify(entityListMessage),
    } as MessageEvent);
    await waitFor(() => {
      expect(result.current.entities).toEqual(
        entityListMessage.payload.entities
      );
    });
  });

  it('handles entity update messages', async () => {
    const mockData = { success: true, data: [] };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });
    const mockWebSocket = {
      close: jest.fn(),
      send: jest.fn(),
      onopen: null,
      onclose: null,
      onerror: null,
      onmessage: null,
    };
    (global.WebSocket as unknown as jest.Mock).mockImplementation(
      () => mockWebSocket
    );
    const { result } = renderHook(() => useRealTimeData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    const entityUpdateMessage = {
      type: 'entity_update',
      payload: {
        entityId: 'entity-1',
        newValue: 'new-value',
        oldValue: 'old-value',
        property: 'status',
        timestamp: '2023-01-01T12:00:00Z',
      },
    };
    mockWebSocket.onmessage?.({
      data: JSON.stringify(entityUpdateMessage),
    } as MessageEvent);
    await waitFor(() => {
      expect(result.current.lastUpdate).toBe(
        entityUpdateMessage.payload.timestamp
      );
    });
  });

  it('handles connection status messages', async () => {
    const mockData = { success: true, data: [] };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });
    const mockWebSocket = {
      close: jest.fn(),
      send: jest.fn(),
      onopen: null,
      onclose: null,
      onerror: null,
      onmessage: null,
    };
    (global.WebSocket as unknown as jest.Mock).mockImplementation(
      () => mockWebSocket
    );
    const { result } = renderHook(() => useRealTimeData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    const connectionStatusMessage = {
      type: 'connection_status',
      payload: {
        status: 'connected',
      },
    };
    mockWebSocket.onmessage?.({
      data: JSON.stringify(connectionStatusMessage),
    } as MessageEvent);
    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });
  });

  it('closes WebSocket on cleanup', async () => {
    const mockData = { success: true, data: [] };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });
    const mockWebSocket = {
      close: jest.fn(),
      send: jest.fn(),
      onopen: null,
      onclose: null,
      onerror: null,
      onmessage: null,
    };
    (global.WebSocket as unknown as jest.Mock).mockImplementation(
      () => mockWebSocket
    );
    const { result, unmount } = renderHook(() => useRealTimeData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    unmount();
    expect(mockWebSocket.close).toHaveBeenCalled();
  });

  it('provides refetch function', async () => {
    const mockData = { success: true, data: [] };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });
    const { result } = renderHook(() => useRealTimeData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(typeof result.current.refetch).toBe('function');
  });

  it('provides getEntityHistory function', async () => {
    const mockData = { success: true, data: [] };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });
    const { result } = renderHook(() => useRealTimeData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(typeof result.current.getEntityHistory).toBe('function');
  });

  it('provides getPropertyHistory function', async () => {
    const mockData = { success: true, data: [] };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });
    const { result } = renderHook(() => useRealTimeData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(typeof result.current.getPropertyHistory).toBe('function');
  });

  it('transforms changes to entities correctly', async () => {
    const mockData = [
      {
        entity_id: 'entity-1',
        entity_type: 'System',
        property_name: 'cpu_usage',
        value: 75,
        timestamp: '2023-01-01T12:00:00Z',
      },
      {
        entity_id: 'entity-1',
        entity_type: 'System',
        property_name: 'memory_usage',
        value: 50,
        timestamp: '2023-01-01T12:01:00Z',
      },
    ];
    const mockResponse = {
      success: true,
      data: mockData,
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });
    const { result } = renderHook(() => useRealTimeData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.entities).toHaveLength(1);
    expect(result.current.entities[0].properties).toHaveProperty('cpu_usage');
    expect(result.current.entities[0].properties).toHaveProperty(
      'memory_usage'
    );
  });

  it('handles invalid timestamps in transformChangesToEntities', async () => {
    const mockData = [
      {
        entity_id: 'entity-1',
        entity_type: 'System',
        property_name: 'cpu_usage',
        value: 75,
        timestamp: 'invalid-timestamp',
      },
    ];
    const mockResponse = {
      success: true,
      data: mockData,
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });
    const { result } = renderHook(() => useRealTimeData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.entities).toHaveLength(1);
  });
});

describe('useIsMobile', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('returns false for desktop width', () => {
    const { result } = renderHook(() => {
      const { useIsMobile } = require('../useRealTimeData');
      return useIsMobile();
    });
    expect(result.current).toBe(false);
  });

  it('returns true for mobile width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    const { result } = renderHook(() => {
      const { useIsMobile } = require('../useRealTimeData');
      return useIsMobile();
    });
    expect(result.current).toBe(true);
  });

  it('updates on window resize', () => {
    const { result } = renderHook(() => {
      const { useIsMobile } = require('../useRealTimeData');
      return useIsMobile();
    });
    expect(result.current).toBe(false);

    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe(true);
  });
});
