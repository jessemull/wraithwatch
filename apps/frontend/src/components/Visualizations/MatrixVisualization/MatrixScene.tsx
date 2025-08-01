import React from 'react';
import { Entity } from '../../../types/entity';
import { EntityChange } from '../../../types/api';
import { MatrixNode } from './MatrixNode';
import { DataFlowLine } from './DataFlowLine';
import { DataParticle } from './DataParticle';

interface MatrixSceneProps {
  entities: Entity[];
  changes: EntityChange[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

export const MatrixScene: React.FC<MatrixSceneProps> = ({
  entities,
  changes,
  selectedEntity,
  onEntitySelect,
}) => {
  console.log('MatrixScene render:', {
    entities: entities.length,
    changes: changes.length,
  });

  return (
    <group>
      {/* Grid lines for matrix effect */}
      {Array.from({ length: 10 }, (_, i) => (
        <group key={`grid-${i}`}>
          {/* Horizontal lines */}
          <mesh position={[0, (i - 5) * 1, 0]}>
            <boxGeometry args={[10, 0.02, 0.02]} />
            <meshStandardMaterial
              color="#00ff00"
              emissive="#00ff00"
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* Vertical lines */}
          <mesh position={[(i - 5) * 1, 0, 0]}>
            <boxGeometry args={[0.02, 10, 0.02]} />
            <meshStandardMaterial
              color="#00ff00"
              emissive="#00ff00"
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Entity nodes arranged in a matrix pattern */}
      {entities.map((entity, index) => {
        // Arrange entities in a grid pattern
        const gridSize = Math.ceil(Math.sqrt(entities.length));
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        const x = (col - gridSize / 2 + 0.5) * 2;
        const y = (row - gridSize / 2 + 0.5) * 2;
        const z = 0;

        return (
          <MatrixNode
            key={entity.id}
            entity={entity}
            position={[x, y, z]}
            isSelected={selectedEntity?.id === entity.id}
            onClick={() => onEntitySelect?.(entity)}
          />
        );
      })}

      {/* Data flow lines between entities */}
      {entities.map((entity, index) => {
        if (index === entities.length - 1) return null;

        const nextEntity = entities[index + 1];
        const gridSize = Math.ceil(Math.sqrt(entities.length));
        const row1 = Math.floor(index / gridSize);
        const col1 = index % gridSize;
        const row2 = Math.floor((index + 1) / gridSize);
        const col2 = (index + 1) % gridSize;

        const start = [
          (col1 - gridSize / 2 + 0.5) * 2,
          (row1 - gridSize / 2 + 0.5) * 2,
          0,
        ];
        const end = [
          (col2 - gridSize / 2 + 0.5) * 2,
          (row2 - gridSize / 2 + 0.5) * 2,
          0,
        ];

        return (
          <DataFlowLine
            key={`${entity.id}-${nextEntity.id}`}
            start={start as [number, number, number]}
            end={end as [number, number, number]}
          />
        );
      })}

      {/* Animated data particles */}
      {changes.slice(0, 30).map((change, index) => {
        const time = Date.now() * 0.001 + index * 0.1;
        const x = Math.sin(time) * 5;
        const y = Math.cos(time * 0.5) * 5;
        const z = Math.sin(time * 0.3) * 2;

        return (
          <DataParticle
            key={`${change.entity_id}-${change.timestamp}-${index}`}
            change={change}
            position={[x, y, z]}
          />
        );
      })}
    </group>
  );
};
