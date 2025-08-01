import React from 'react';
import { Entity } from '../../../types/entity';
import { EntityChange } from '../../../types/api';
import { Text } from '@react-three/drei';
import { EntityNode } from './EntityNode';
import { ChangeParticle } from './ChangeParticle';

interface TimelineSceneProps {
  entities: Entity[];
  changes: EntityChange[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

export const TimelineScene: React.FC<TimelineSceneProps> = ({
  entities,
  changes,
  selectedEntity,
  onEntitySelect,
}) => {
  console.log('TimelineScene render:', {
    entities: entities.length,
    changes: changes.length,
  });

  return (
    <group>
      {/* Central timeline axis */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 10, 8]} />
        <meshStandardMaterial
          color="#4a90e2"
          emissive="#4a90e2"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Timeline markers */}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[0, (i - 5) * 1, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color="#ffd93d"
            emissive="#ffd93d"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Entity nodes - arrange in a circle */}
      {entities.map((entity, index) => {
        const angle = (index / entities.length) * Math.PI * 2;
        const radius = 4;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 2;

        return (
          <EntityNode
            key={entity.id}
            entity={entity}
            position={[x, y, z]}
            isSelected={selectedEntity?.id === entity.id}
            onClick={() => onEntitySelect?.(entity)}
          />
        );
      })}

      {/* Change particles - more visible */}
      {changes.slice(0, 50).map((change, index) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * 3;
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

      {/* Debug text */}
      <Text
        position={[0, 6, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {`Entities: ${entities.length} | Changes: ${changes.length}`}
      </Text>
    </group>
  );
};
