import { Entity } from './entity';

export interface WebSocketMessage {
  type:
    | 'entity_update'
    | 'entity_list'
    | 'property_change'
    | 'connection_status';
  payload: unknown;
}

export interface EntityUpdateMessage {
  type: 'entity_update';
  payload: {
    entityId: string;
    property: string;
    timestamp: string;
    oldValue: string | number;
    newValue: string | number;
  };
}

export interface EntityListMessage {
  type: 'entity_list';
  payload: {
    entities: Entity[];
  };
}

export interface PropertyChangeMessage {
  type: 'property_change';
  payload: {
    entityId: string;
    propertyName: string;
    change: {
      timestamp: string;
      oldValue: string | number;
      newValue: string | number;
      changeType?: 'increment' | 'decrement' | 'replacement';
    };
  };
}
