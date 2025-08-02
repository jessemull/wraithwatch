import React, { useMemo, useCallback } from 'react';
import { Entity } from '../../../types/entity';
import { EntityNode } from './EntityNode';
import { ChangeParticle } from './ChangeParticle';
import { TimeScale } from './TimeScale';

interface TimelineSceneProps {
  entities: Entity[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

export const TimelineScene: React.FC<TimelineSceneProps> = ({
  entities,
  selectedEntity,
  onEntitySelect,
}) => {
  // Memoize entity positions...

  const { entityPositions } = useMemo(() => {
    // Use current time as timeline bounds
    const now = Date.now();
    const startTime = now - 24 * 60 * 60 * 1000; // 24 hours ago
    const endTime = now;

    // Calculate all entity positions...

    const positions = entities.map((entity, index) => {
      // This ensures entities are spread across the entire timeline height...

      const entityY = (index / (entities.length - 1) - 0.5) * 16; // Spread across -8 to +8

      // Position entities randomly around the timeline instead of in a perfect circle...

      const angle = Math.random() * Math.PI * 2; // Random angle
      const radius = 2 + Math.random() * 4; // Random radius between 2-6

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      return [x, entityY, z] as [number, number, number];
    });

    return {
      timelineBounds: { startTime, endTime },
      entityPositions: positions,
    };
  }, [entities]);

  const handleEntityClick = useCallback(
    (entity: Entity) => {
      onEntitySelect?.(entity);
    },
    [onEntitySelect]
  );

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 20, 8]} />
        <meshStandardMaterial
          color="#4a90e2"
          emissive="#4a90e2"
          emissiveIntensity={0.3}
        />
      </mesh>
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={i} position={[0, (i - 10) * 1, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color="#ffd93d"
            emissive="#ffd93d"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      {entities.map((entity, index) => (
        <EntityNode
          key={entity.id}
          entity={entity}
          position={entityPositions[index]}
          isSelected={selectedEntity?.id === entity.id}
          onClick={() => handleEntityClick(entity)}
        />
      ))}
      {selectedEntity &&
        Array.from({ length: 150 }, (_, index) => {
          // Find the selected entity's position
          const selectedEntityIndex = entities.findIndex(
            e => e.id === selectedEntity.id
          );
          const entityPosition = entityPositions[selectedEntityIndex];

          // Generate random positions around the entity
          const angle = Math.random() * Math.PI * 2;
          const radius = 1 + Math.random() * 3; // Moderate horizontal spread: 1-4 units from entity

          const x = entityPosition[0] + Math.cos(angle) * radius;
          const y = entityPosition[1] + (Math.random() - 0.5) * 12; // Much more vertical spread: ±6 units around entity
          const z = entityPosition[2] + Math.sin(angle) * radius;

          return (
            <ChangeParticle
              key={`change-particle-${index}`}
              position={[x, y, z]}
            />
          );
        })}
      {selectedEntity && <TimeScale position={[0, 0, 0]} />}
    </group>
  );
};
