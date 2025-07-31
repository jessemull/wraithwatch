import { MAX_PROPERTY_HISTORY_LENGTH } from '../constants';
import { Entity } from '../types';

export const updateEntityProperty = (
  entity: Entity,
  newValue: string | number,
  oldValue: string | number,
  propertyName: string,
  timestamp: string
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
  entityId: string,
  entities: Entity[],
  updateFunction: (entity: Entity) => Entity
): Entity[] => {
  return entities.map(entity =>
    entity.id === entityId ? updateFunction(entity) : entity
  );
};
