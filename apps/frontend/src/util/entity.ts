import { Entity } from '../types';
import { MAX_PROPERTY_HISTORY_LENGTH } from '../constants';

export const updateEntityProperty = (
  entity: Entity,
  propertyName: string,
  newValue: string | number,
  timestamp: string,
  oldValue: string | number
): Entity => {
  const updatedEntity = { ...entity };

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
  }

  updatedEntity.lastSeen = timestamp;
  updatedEntity.changesToday++;

  return updatedEntity;
};

export const updateEntityInList = (
  entities: Entity[],
  entityId: string,
  updateFunction: (entity: Entity) => Entity
): Entity[] => {
  return entities.map(entity =>
    entity.id === entityId ? updateFunction(entity) : entity
  );
};
