import { Entity } from './entity';

export interface WebSocketState {
  entities: Entity[];
  isConnected: boolean;
  lastUpdate: string | null;
}

export interface WebSocketHandlers {
  onConnectionClose: () => void;
  onConnectionError: (error: Event) => void;
  onConnectionOpen: () => void;
  onMessageReceived: (message: WebSocketMessage) => void;
}

export interface WebSocketMessage {
  payload: unknown;
  type:
    | 'connection_status'
    | 'entity_list'
    | 'entity_update'
    | 'property_change';
}

export interface EntityUpdateMessage {
  payload: {
    entityId: string;
    newValue: string | number;
    oldValue: string | number;
    property: string;
    timestamp: string;
  };
  type: 'entity_update';
}

export interface EntityListMessage {
  payload: {
    entities: Entity[];
  };
  type: 'entity_list';
}

export interface PropertyChangeMessage {
  payload: {
    change: {
      changeType?: 'decrement' | 'increment' | 'replacement';
      newValue: string | number;
      oldValue: string | number;
      timestamp: string;
    };
    entityId: string;
    propertyName: string;
  };
  type: 'property_change';
}
