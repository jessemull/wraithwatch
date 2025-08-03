import { renderHook, act, waitFor } from '@testing-library/react';
import { useRealTimeData } from '../useRealTimeData';

// Mock fetch
global.fetch = jest.fn();

// Mock WebSocket
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
}));

// Mock config
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

// Mock constants
jest.mock('../../constants', () => ({
  WEBSOCKET_CONNECTION_STATUS: {
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
  },
}));

// Mock utility functions
jest.mock('../../util/entity', () => ({
  updateEntityInList: jest.fn((entityId, entities, updater) => {
    return entities.map(entity =>
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
      };
    }
  ),
}));

// Mock websocket utilities
jest.mock('../../util/websocket', () => ({
  isEntityListMessage: jest.fn(message => message.type === 'entity_list'),
  isEntityUpdateMessage: jest.fn(message => message.type === 'entity_update'),
  isConnectionStatusMessage: jest.fn(
    message => message.type === 'connection_status'
  ),
}));

describe('useRealTimeData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    (global.WebSocket as jest.Mock).mockClear();
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

    (global.WebSocket as jest.Mock).mockImplementation(() => mockWebSocket);

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

    (global.WebSocket as jest.Mock).mockImplementation(() => mockWebSocket);

    const { result } = renderHook(() => useRealTimeData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Simulate WebSocket open
    act(() => {
      if (mockWebSocket.onopen) {
        mockWebSocket.onopen();
      }
    });

    expect(result.current.isConnected).toBe(true);

    // Simulate WebSocket close
    act(() => {
      if (mockWebSocket.onclose) {
        mockWebSocket.onclose();
      }
    });

    expect(result.current.isConnected).toBe(false);
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
});
