import { useCallback, useEffect, useRef, useState } from 'react';
import { WEBSOCKET_CONNECTION_STATUS } from '../constants';
import {
  Entity,
  EntityListMessage,
  EntityUpdateMessage,
  WebSocketHandlers,
  WebSocketMessage,
  WebSocketState,
} from '../types';
import {
  isConnectionStatusMessage,
  isEntityListMessage,
  isEntityUpdateMessage,
  updateEntityInList,
  updateEntityProperty,
} from '../util';

// WebSocket message handlers...

const createMessageHandlers = (
  setEntities: React.Dispatch<React.SetStateAction<Entity[]>>,
  setLastUpdate: React.Dispatch<React.SetStateAction<string | null>>,
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>
): WebSocketHandlers => {
  const handleEntityListMessage = (message: EntityListMessage) => {
    const { entities } = message.payload;
    setEntities(entities);
  };

  const handleEntityUpdateMessage = (message: EntityUpdateMessage) => {
    const { entityId, newValue, oldValue, property, timestamp } =
      message.payload;

    setEntities(prevEntities =>
      updateEntityInList(entityId, prevEntities, entity =>
        updateEntityProperty(entity, newValue, oldValue, property, timestamp)
      )
    );

    setLastUpdate(timestamp);
  };

  const handleConnectionStatusMessage = (message: {
    type: 'connection_status';
    payload: { status: string };
  }) => {
    const isConnected =
      message.payload.status === WEBSOCKET_CONNECTION_STATUS.CONNECTED;
    setIsConnected(isConnected);
  };

  const onMessageReceived = (message: WebSocketMessage) => {
    if (isEntityListMessage(message)) {
      handleEntityListMessage(message);
    } else if (isEntityUpdateMessage(message)) {
      handleEntityUpdateMessage(message);
    } else if (isConnectionStatusMessage(message)) {
      handleConnectionStatusMessage(message);
    }
  };

  const onConnectionOpen = () => {
    console.log('WebSocket connected');
    setIsConnected(true);
  };

  const onConnectionClose = () => {
    console.log('WebSocket disconnected');
    setIsConnected(false);
  };

  const onConnectionError = (error: Event) => {
    console.error('WebSocket error:', error);
    setIsConnected(false);
  };

  return {
    onConnectionClose,
    onConnectionError,
    onConnectionOpen,
    onMessageReceived,
  };
};

// WebSocket connection management...

const createWebSocketConnection = (
  url: string,
  handlers: WebSocketHandlers
): WebSocket => {
  const websocket = new WebSocket(url);

  websocket.onopen = handlers.onConnectionOpen;
  websocket.onclose = handlers.onConnectionClose;
  websocket.onerror = handlers.onConnectionError;
  websocket.onmessage = event => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      handlers.onMessageReceived(message);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  return websocket;
};

// Main hook...

export const useWebSocket = (url: string): WebSocketState => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const websocketRef = useRef<WebSocket | null>(null);

  const messageHandlers = useCallback(
    () => createMessageHandlers(setEntities, setLastUpdate, setIsConnected),
    [setEntities, setLastUpdate, setIsConnected]
  );

  useEffect(() => {
    const handlers = messageHandlers();
    const websocket = createWebSocketConnection(url, handlers);
    websocketRef.current = websocket;

    return () => {
      websocket.close();
      websocketRef.current = null;
    };
  }, [url, messageHandlers]);

  return { entities, isConnected, lastUpdate };
};
