import { Entity, EntityPosition } from '../types/entity';
import { EntityChange, HistoryQuery } from '../types/api';
import { WEBSOCKET_CONNECTION_STATUS } from '../constants';
import { WebSocketMessage } from '../types/websocket';
import { config } from '../config';
import { updateEntityInList, updateEntityProperty } from '../util/entity';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  isEntityListMessage,
  isEntityUpdateMessage,
  isConnectionStatusMessage,
} from '../util/websocket';

export const useRealTimeData = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [changes, setChanges] = useState<EntityChange[]>([]);
  const [positions, setPositions] = useState<EntityPosition[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const websocketRef = useRef<WebSocket | null>(null);

  const transformChangesToEntities = (changes: EntityChange[]): Entity[] => {
    const entityMap = new Map<string, Entity>();

    changes.forEach(change => {
      if (!entityMap.has(change.entity_id)) {
        entityMap.set(change.entity_id, {
          id: change.entity_id,
          name: change.entity_id,
          type: change.entity_type as Entity['type'],
          properties: {},
          lastSeen: change.timestamp,
          changesToday: 0,
        });
      }

      const entity = entityMap.get(change.entity_id)!;

      if (!entity.properties) {
        entity.properties = {};
      }

      entity.properties[change.property_name] = {
        name: change.property_name,
        currentValue: change.value,
        lastChanged: change.timestamp,
        history: [
          {
            timestamp: change.timestamp,
            oldValue: change.value,
            newValue: change.value,
          },
        ],
      };

      try {
        const changeTimestamp = new Date(change.timestamp);
        const lastSeenTimestamp = new Date(entity.lastSeen);

        if (
          !isNaN(changeTimestamp.getTime()) &&
          !isNaN(lastSeenTimestamp.getTime()) &&
          changeTimestamp > lastSeenTimestamp
        ) {
          entity.lastSeen = change.timestamp;
        }
      } catch {
        return;
      }
    });

    return Array.from(entityMap.values());
  };

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${config.api.baseUrl}/api/test/data?limit=10000`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error('Invalid response from API');
      }

      setChanges(result.data);
      setPositions(result.positions || []);
      setMetrics(result.metrics || null);
      const transformedEntities = transformChangesToEntities(result.data);
      setEntities(transformedEntities);
    } catch (err) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('Error loading initial data:', err);
      }
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  const getEntityHistory = async (
    entityId: string,
    options: HistoryQuery = {}
  ) => {
    const params = new URLSearchParams();

    if (options.propertyName)
      params.append('propertyName', options.propertyName);
    if (options.startTime) params.append('startTime', options.startTime);
    if (options.endTime) params.append('endTime', options.endTime);
    if (options.limit) params.append('limit', options.limit.toString());

    const response = await fetch(
      `${config.api.baseUrl}/api/history/entity/${entityId}?${params}`
    );

    if (!response.ok) throw new Error('Failed to fetch entity history');

    const result = await response.json();
    return result.data;
  };

  const getPropertyHistory = async (
    entityId: string,
    propertyName: string,
    options: HistoryQuery = {}
  ) => {
    const params = new URLSearchParams();

    if (options.startTime) params.append('startTime', options.startTime);
    if (options.endTime) params.append('endTime', options.endTime);
    if (options.limit) params.append('limit', options.limit.toString());

    const response = await fetch(
      `${config.api.baseUrl}/api/history/entity/${entityId}/property/${propertyName}?${params}`
    );

    if (!response.ok) throw new Error('Failed to fetch property history');

    const result = await response.json();
    return result.data;
  };

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    if (isEntityListMessage(message)) {
      const { entities } = message.payload;
      setEntities(entities);
    } else if (isEntityUpdateMessage(message)) {
      const { entityId, newValue, oldValue, property, timestamp } =
        message.payload;

      setEntities(prevEntities =>
        updateEntityInList(entityId, prevEntities, entity =>
          updateEntityProperty(entity, newValue, oldValue, property, timestamp)
        )
      );

      setLastUpdate(timestamp);
    } else if (isConnectionStatusMessage(message)) {
      const isConnected =
        message.payload.status === WEBSOCKET_CONNECTION_STATUS.CONNECTED;
      setIsConnected(isConnected);
    }
  }, []);

  const connectWebSocket = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close();
    }

    const websocket = new WebSocket(config.websocket.url);

    websocket.onopen = () => {
      if (process.env.NODE_ENV !== 'test') {
        console.log('WebSocket connected');
      }
      setIsConnected(true);
    };

    websocket.onclose = () => {
      if (process.env.NODE_ENV !== 'test') {
        console.log('WebSocket disconnected');
      }
      setIsConnected(false);
    };

    websocket.onerror = (error: Event) => {
      if (process.env.NODE_ENV !== 'test') {
        console.error('WebSocket error:', error);
      }
      setIsConnected(false);
    };

    websocket.onmessage = event => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        handleWebSocketMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    websocketRef.current = websocket;
  }, [handleWebSocketMessage]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (!loading) {
      connectWebSocket();
    }

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
        websocketRef.current = null;
      }
    };
  }, [loading, connectWebSocket]);

  return {
    entities,
    changes,
    positions,
    metrics,
    loading,
    error,
    isConnected,
    lastUpdate,
    refetch: fetchInitialData,
    getEntityHistory,
    getPropertyHistory,
  };
};

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};
