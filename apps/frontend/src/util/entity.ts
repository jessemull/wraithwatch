import { MAX_PROPERTY_HISTORY_LENGTH } from '../constants';
import { Entity } from '../types';

// Entity type color mapping - shared across components...

export const ENTITY_TYPE_COLORS: Record<string, string> = {
  AI_Agent: 'bg-blue-500',
  Network_Node: 'bg-green-500',
  Threat: 'bg-red-500',
  System: 'bg-yellow-500',
  User: 'bg-purple-500',
  Sensor: 'bg-cyan-500',
  Server: 'bg-orange-500',
  Workstation: 'bg-indigo-500',
};

export const getEntityTypeColor = (entityType: string): string => {
  return ENTITY_TYPE_COLORS[entityType] || 'bg-gray-500';
};

// Status color mapping for entity properties...

export const STATUS_COLORS = {
  routing_status: {
    optimal: 'bg-green-500 text-white',
    maintenance: 'bg-yellow-500 text-black',
    degraded: 'bg-orange-500 text-white',
    default: 'bg-gray-500 text-white',
  },
  severity: {
    critical: 'bg-red-500 text-white',
    high: 'bg-orange-500 text-white',
    medium: 'bg-yellow-500 text-black',
    low: 'bg-green-500 text-white',
    default: 'bg-gray-500 text-white',
  },
  mitigation_status: {
    mitigated: 'bg-green-500 text-white',
    mitigating: 'bg-yellow-500 text-black',
    detected: 'bg-red-500 text-white',
    default: 'bg-gray-500 text-white',
  },
  last_activity: {
    locked: 'bg-red-500 text-white',
    offline: 'bg-gray-500 text-white',
    active: 'bg-green-500 text-white',
    default: 'bg-yellow-500 text-black',
  },
  permission_level: {
    super_admin: 'bg-red-500 text-white',
    admin: 'bg-orange-500 text-white',
    user: 'bg-blue-500 text-white',
    default: 'bg-gray-500 text-white',
  },
} as const;

export const getStatusColor = (name: string, value: string): string => {
  const colorMap = STATUS_COLORS[name as keyof typeof STATUS_COLORS];
  if (colorMap) {
    return colorMap[value as keyof typeof colorMap] || colorMap.default;
  }
  return 'bg-gray-500 text-white';
};

// Utility functions for entity property formatting...

export const formatPropertyName = (name: string): string => {
  return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const formatText = (text: string): string => {
  return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const formatEntityType = (entityType: string): string => {
  return entityType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const getUnit = (name: string): string => {
  if (name.includes('rate') || name.includes('loss')) return '%';
  if (name.includes('latency')) return 'ms';
  if (name.includes('bandwidth')) return 'Mbps';
  if (name.includes('count')) return '';
  if (name.includes('duration')) return 'min';
  return '';
};

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString();
};

export const updateEntityProperty = (
  entity: Entity,
  newValue: string | number,
  oldValue: string | number,
  propertyName: string,
  timestamp: string
): Entity => {
  const updatedEntity = { ...entity };

  if (!updatedEntity.properties) {
    updatedEntity.properties = {};
  }

  if (updatedEntity.properties[propertyName]) {
    const property = updatedEntity.properties[propertyName];
    const propertyChange = { timestamp, oldValue, newValue };

    updatedEntity.properties[propertyName] = {
      ...property,
      currentValue: newValue,
      lastChanged: timestamp,
      history: [...property.history, propertyChange].slice(
        -MAX_PROPERTY_HISTORY_LENGTH
      ),
    };
  } else {
    const propertyChange = { timestamp, oldValue, newValue };
    updatedEntity.properties[propertyName] = {
      name: propertyName,
      currentValue: newValue,
      lastChanged: timestamp,
      history: [propertyChange],
    };
  }

  updatedEntity.lastSeen = timestamp;
  updatedEntity.changesToday++;

  return updatedEntity;
};

export const updateEntityInList = (
  entityId: string,
  entities: Entity[],
  updateFunction: (entity: Entity) => Entity
): Entity[] => {
  return entities.map(entity =>
    entity.id === entityId ? updateFunction(entity) : entity
  );
};
