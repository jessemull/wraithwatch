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
