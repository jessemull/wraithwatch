export type EntityType = 'System' | 'User' | 'Sensor';

export interface Entity {
  changesToday: number;
  id: string;
  lastSeen: string;
  name: string;
  properties: Record<string, EntityProperty>;
  type: EntityType;
}

export interface EntityProperty {
  currentValue: string | number;
  history: PropertyChange[];
  lastChanged: string;
  name: string;
}

export interface PropertyChange {
  changeType?: 'decrement' | 'increment' | 'replacement';
  newValue: string | number;
  oldValue: string | number;
  timestamp: string;
}
