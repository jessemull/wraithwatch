import { useMemo } from 'react';
import { Entity } from '../types/entity';

interface EntityPosition {
  entity_id: string;
  entity_type: string;
  name: string;
  timeline_position: {
    x: number;
    y: number;
    z: number;
  };
  network_position: {
    x: number;
    y: number;
    z: number;
  };
  change_particles: Array<{
    x: number;
    y: number;
    z: number;
  }>;
}

export const useEntityPositions = (
  entities: Entity[],
  positions: EntityPosition[]
) => {
  return useMemo(() => {
    const positionMap = new Map<string, EntityPosition>();

    // Create a map of entity_id to position data
    positions.forEach(position => {
      positionMap.set(position.entity_id, position);
    });

    // Map entities to their positions
    const entityPositions = entities.map(entity => {
      const position = positionMap.get(entity.id);
      return {
        entity,
        position,
      };
    });

    return {
      entityPositions,
      positionMap,
    };
  }, [entities, positions]);
};
