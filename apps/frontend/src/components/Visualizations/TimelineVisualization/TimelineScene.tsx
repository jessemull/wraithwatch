import React, { useMemo } from 'react';
import { ChangeParticle } from './ChangeParticle';
import { Entity } from '../../../types/entity';
import { EntityChange } from '../../../types/api';
import { EntityNode } from './EntityNode';
import { Text } from '@react-three/drei';
import { TimeScale } from './TimeScale';

interface TimelineSceneProps {
  entities: Entity[];
  changes: EntityChange[];
  allChanges: EntityChange[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

export const TimelineScene: React.FC<TimelineSceneProps> = ({
  entities,
  changes,
  allChanges,
  selectedEntity,
  onEntitySelect,
}) => {
  // Memoize timeline bounds and entity positions
  const { entityPositions } = useMemo(() => {
    const sortedChanges = [...allChanges].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const startTime = new Date(sortedChanges[0].timestamp).getTime();
    const endTime = new Date(
      sortedChanges[sortedChanges.length - 1].timestamp
    ).getTime();

    // Calculate all entity positions
    const positions = entities.map((entity, index) => {
      // Distribute entities vertically along the y-axis based on their index
      // This ensures entities are spread across the entire timeline height
      const entityY = (index / (entities.length - 1) - 0.5) * 16; // Spread across -8 to +8

      // Position entities randomly around the timeline instead of in a perfect circle
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
  }, [allChanges, entities]);
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
          onClick={() => onEntitySelect?.(entity)}
        />
      ))}
      {selectedEntity &&
        changes.map((change, index) => {
          // Find the selected entity's position
          const selectedEntityIndex = entities.findIndex(
            e => e.id === selectedEntity.id
          );
          const entityPosition = entityPositions[selectedEntityIndex];

          // Calculate time progress for this change
          const sortedChanges = [...allChanges].sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          const startTime = new Date(sortedChanges[0].timestamp).getTime();
          const endTime = new Date(
            sortedChanges[sortedChanges.length - 1].timestamp
          ).getTime();
          const currentTime = new Date(change.timestamp).getTime();

          const timeProgress =
            (currentTime - startTime) / (endTime - startTime);
          const y = (timeProgress - 0.5) * 8; // Use same scale as entities

          // Position change particles scattered around the entity
          const angle = Math.random() * Math.PI * 2;
          const radius = 0.5 + Math.random() * 2; // Random distance from entity
          const x = entityPosition[0] + Math.cos(angle) * radius;
          const z = entityPosition[2] + Math.sin(angle) * radius;

          return (
            <ChangeParticle
              key={`${change.entity_id}-${change.timestamp}-${index}`}
              change={change}
              position={[x, y, z]}
            />
          );
        })}
      <Text
        position={[0, 10, 0]}
        fontSize={1.0}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="black"
      >
        {selectedEntity
          ? `${selectedEntity.name}: ${changes.length} changes`
          : `Click an entity to view its changes (${entities.length} entities)`}
      </Text>
      {selectedEntity && <TimeScale changes={changes} position={[0, 0, 0]} />}
    </group>
  );
};
