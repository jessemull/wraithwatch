import React from 'react';
import { Entity } from '../../../types/entity';
import { EntityChange } from '../../../types/api';
import { NetworkNode } from './NetworkNode';
import { ConnectionLine } from './ConnectionLine';
import { ChangeParticle } from './ChangeParticle';

interface NetworkSceneProps {
  entities: Entity[];
  changes: EntityChange[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

export const NetworkScene: React.FC<NetworkSceneProps> = ({
  entities,
  changes,
  selectedEntity,
  onEntitySelect,
}) => {
  console.log('NetworkScene render:', {
    entities: entities.length,
    changes: changes.length,
  });

  return (
    <group>
      {/* Network nodes - arrange in a force-directed-like pattern */}
      {entities.map((entity, index) => {
        // Create a more interesting layout - nodes in a network pattern
        const angle = (index / entities.length) * Math.PI * 2;
        const radius = 3 + Math.random() * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 3;

        return (
          <NetworkNode
            key={entity.id}
            entity={entity}
            position={[x, y, z]}
            isSelected={selectedEntity?.id === entity.id}
            onClick={() => onEntitySelect?.(entity)}
          />
        );
      })}

      {/* Connection lines between nodes */}
      {entities.map((entity, index) => {
        if (index === entities.length - 1) return null; // Skip last entity

        const nextEntity = entities[index + 1];
        const angle1 = (index / entities.length) * Math.PI * 2;
        const angle2 = ((index + 1) / entities.length) * Math.PI * 2;
        const radius1 = 3 + Math.random() * 2;
        const radius2 = 3 + Math.random() * 2;

        const start = [
          Math.cos(angle1) * radius1,
          (Math.random() - 0.5) * 3,
          Math.sin(angle1) * radius1,
        ];
        const end = [
          Math.cos(angle2) * radius2,
          (Math.random() - 0.5) * 3,
          Math.sin(angle2) * radius2,
        ];

        return (
          <ConnectionLine
            key={`${entity.id}-${nextEntity.id}`}
            start={start as [number, number, number]}
            end={end as [number, number, number]}
          />
        );
      })}

      {/* Change particles floating around */}
      {changes.slice(0, 30).map((change, index) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * 4;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 4;

        return (
          <ChangeParticle
            key={`${change.entity_id}-${change.timestamp}-${index}`}
            change={change}
            position={[x, y, z]}
          />
        );
      })}
    </group>
  );
};
