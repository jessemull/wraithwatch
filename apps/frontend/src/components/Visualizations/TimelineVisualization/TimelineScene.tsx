import React, { useMemo, useCallback } from 'react';
import { Entity, EntityPosition } from '../../../types/entity';
import { EntityNode } from './EntityNode';
import { ChangeParticle } from './ChangeParticle';
import { TimeScale } from './TimeScale';

interface TimelineSceneProps {
  entities: Entity[];
  positions: EntityPosition[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

export const TimelineScene: React.FC<TimelineSceneProps> = ({
  entities,
  positions,
  selectedEntity,
  onEntitySelect,
}) => {
  // Memoize entity positions...

  const { entityPositions } = useMemo(() => {
    // Use current time as timeline bounds...

    const now = Date.now();
    const startTime = now - 24 * 60 * 60 * 1000; // 24 hours ago
    const endTime = now;

    // Calculate entity positions using real data or fallback to algorithmic positioning...

    const calculatedPositions = entities.map((entity, index) => {
      // Try to find real position data for this entity...

      const positionData = positions.find(p => p.entity_id === entity.id);

      if (positionData) {
        // Use real position data...

        const { x, y, z } = positionData.timeline_position;
        return [x, y, z] as [number, number, number];
      }

      // Fallback to algorithmic positioning...

      const entityY = (index / (entities.length - 1) - 0.5) * 16; // Spread across -8 to +8
      const angle = Math.random() * Math.PI * 2; // Random angle
      const radius = 2 + Math.random() * 4; // Random radius between 2-6
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      return [x, entityY, z] as [number, number, number];
    });

    return {
      timelineBounds: { startTime, endTime },
      entityPositions: calculatedPositions,
    };
  }, [entities, positions]);

  const handleEntityClick = useCallback(
    (entity: Entity) => {
      onEntitySelect?.(entity);
    },
    [onEntitySelect]
  );

  const changeParticles = useMemo(() => {
    if (!selectedEntity) return null;

    // Try to find real change particles for the selected entity...

    const selectedEntityPosition = positions.find(
      p => p.entity_id === selectedEntity.id
    );

    if (
      selectedEntityPosition &&
      selectedEntityPosition.change_particles.length > 0
    ) {
      // Use real change particles...

      return selectedEntityPosition.change_particles.map((particle, index) => (
        <ChangeParticle
          key={`change-particle-${selectedEntity.id}-${index}`}
          position={[particle.x, particle.y, particle.z]}
        />
      ));
    }

    // Fallback to algorithmic particles...
    
    const particleCount = 150;
    const selectedEntityIndex = entities.findIndex(
      e => e.id === selectedEntity.id
    );
    const entityPosition = entityPositions[selectedEntityIndex];

    return Array.from({ length: particleCount }, (_, index) => {
      const seed = selectedEntity.id.charCodeAt(0) + index;
      const angle = (seed * 137.5) % (Math.PI * 2);
      const radius = 1 + (seed % 300) / 100;

      const x = entityPosition[0] + Math.cos(angle) * radius;
      const y = entityPosition[1] + ((seed % 1200) / 1000 - 0.5) * 12;
      const z = entityPosition[2] + Math.sin(angle) * radius;

      return (
        <ChangeParticle
          key={`change-particle-${selectedEntity.id}-${index}`}
          position={[x, y, z]}
        />
      );
    });
  }, [selectedEntity, entities, entityPositions, positions]);

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
      {changeParticles}
      {selectedEntity && <TimeScale position={[0, 0, 0]} />}
    </group>
  );
};
