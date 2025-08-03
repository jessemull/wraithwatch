import { Entity } from '../types/entity';

export function transformDatabaseDataToEntities(dbData: any[]): Entity[] {
  const entityMap = new Map<string, Entity>();

  dbData.forEach(item => {
    const entityId = item.entity_id || item.entityId;
    const propertyName = item.property_name || item.propertyName;
    const value = item.value;
    const timestamp = item.timestamp || item.TTL || new Date().toISOString();

    if (!entityMap.has(entityId)) {
      entityMap.set(entityId, {
        id: entityId,
        name: entityId,
        type: item.entity_type || 'Unknown',
        properties: {},
        lastSeen: timestamp,
        changesToday: 0,
      });
    }

    const entity = entityMap.get(entityId)!;

    if (!entity.properties[propertyName]) {
      entity.properties[propertyName] = {
        name: propertyName,
        currentValue: value,
        lastChanged: timestamp,
        history: [],
      };
    } else {
      entity.properties[propertyName].currentValue = value;
      entity.properties[propertyName].lastChanged = timestamp;
    }
  });

  return Array.from(entityMap.values());
}
