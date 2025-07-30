// Local copy of shared types for the frontend

export type EntityType = 'System' | 'User' | 'Sensor';

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  properties: Record<string, EntityProperty>;
  lastSeen: string;
  changesToday: number;
}

export interface EntityProperty {
  name: string;
  currentValue: string | number;
  lastChanged: string;
  history: PropertyChange[];
}

export interface PropertyChange {
  timestamp: string;
  oldValue: string | number;
  newValue: string | number;
  changeType?: 'increment' | 'decrement' | 'replacement';
}

// WebSocket message types
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
    change: PropertyChange;
  };
}
