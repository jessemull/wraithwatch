import { useState, useEffect, useCallback } from 'react';
import { Entity, WebSocketMessage } from '../types';

interface UseWebSocketReturn {
  entities: Entity[];
  isConnected: boolean;
  lastUpdate: string | null;
}

export const useWebSocket = (url: string): UseWebSocketReturn => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'entity_list':
        if (
          message.payload &&
          typeof message.payload === 'object' &&
          'entities' in message.payload
        ) {
          setEntities((message.payload as { entities: Entity[] }).entities);
        }
        break;

      case 'entity_update':
        if (
          message.payload &&
          typeof message.payload === 'object' &&
          'entityId' in message.payload
        ) {
          const payload = message.payload as {
            entityId: string;
            property: string;
            timestamp: string;
            oldValue: string | number;
            newValue: string | number;
          };
          const { entityId, property, timestamp, oldValue, newValue } = payload;
          setEntities(prevEntities =>
            prevEntities.map(entity => {
              if (entity.id === entityId) {
                const updatedEntity = { ...entity };
                if (updatedEntity.properties[property]) {
                  updatedEntity.properties[property] = {
                    ...updatedEntity.properties[property],
                    currentValue: newValue,
                    lastChanged: timestamp,
                    history: [
                      ...updatedEntity.properties[property].history,
                      { timestamp, oldValue, newValue },
                    ].slice(-10), // Keep last 10 changes
                  };
                }
                updatedEntity.lastSeen = timestamp;
                updatedEntity.changesToday++;
                return updatedEntity;
              }
              return entity;
            })
          );
          setLastUpdate(timestamp);
        }
        break;

      case 'connection_status':
        if (
          message.payload &&
          typeof message.payload === 'object' &&
          'status' in message.payload
        ) {
          setIsConnected(
            (message.payload as { status: string }).status === 'connected'
          );
        }
        break;
    }
  }, []);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('🔌 WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = event => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        handleMessage(message);
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onerror = error => {
      console.error('❌ WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [url, handleMessage]);

  return { entities, isConnected, lastUpdate };
};
