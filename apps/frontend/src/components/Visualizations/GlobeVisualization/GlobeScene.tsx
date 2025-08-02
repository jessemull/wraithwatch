import React, { useMemo } from 'react';
import { Entity, EntityPosition } from '../../../types/entity';
import { GlobeNode } from './GlobeNode';
import { ChangeParticle } from './ChangeParticle';

interface GlobeSceneProps {
  entities: Entity[];
  positions: EntityPosition[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

export const GlobeScene: React.FC<GlobeSceneProps> = ({
  entities,
  positions,
  selectedEntity,
  onEntitySelect,
}) => {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          color="#4a90e2"
          transparent
          opacity={0.3}
          emissive="#4a90e2"
          emissiveIntensity={0.1}
        />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={`lat-${i}`} rotation={[0, (i / 8) * Math.PI, 0]}>
          <ringGeometry args={[3, 3.01, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
        </mesh>
      ))}
      {entities.map(entity => {
        // Find position data for this entity...

        const positionData = positions.find(p => p.entity_id === entity.id);

        if (!positionData) {
          // Fallback to algorithmic positioning if no position data...

          const index = entities.findIndex(e => e.id === entity.id);
          const lat = (index / entities.length) * Math.PI - Math.PI / 2;
          const lon = (index * 2.4) % (Math.PI * 2);
          const radius = 3.2;

          const x = radius * Math.cos(lat) * Math.cos(lon);
          const y = radius * Math.sin(lat);
          const z = radius * Math.cos(lat) * Math.sin(lon);

          return (
            <GlobeNode
              key={entity.id}
              entity={entity}
              position={[x, y, z]}
              isSelected={selectedEntity?.id === entity.id}
              onClick={() => onEntitySelect?.(entity)}
            />
          );
        }

        // Use real position data...

        const { x, y, z } = positionData.timeline_position;

        return (
          <GlobeNode
            key={entity.id}
            entity={entity}
            position={[x, y, z]}
            isSelected={selectedEntity?.id === entity.id}
            onClick={() => onEntitySelect?.(entity)}
          />
        );
      })}
      {useMemo(() => {
        // Use change particles from position data if available...

        const allChangeParticles = positions.flatMap(p => p.change_particles);

        if (allChangeParticles.length > 0) {
          return allChangeParticles.map((particle, index) => (
            <ChangeParticle
              key={`change-particle-globe-${index}`}
              position={[particle.x, particle.y, particle.z]}
            />
          ));
        }

        // Fallback to algorithmic particles...

        return Array.from({ length: 40 }, (_, index) => {
          const baseAngle = (index * 137.5) % (Math.PI * 2);
          const radius = 4 + Math.sin(baseAngle) * 0.5;
          const x = radius * Math.cos(baseAngle);
          const z = radius * Math.sin(baseAngle);
          const y = Math.sin(baseAngle * 2) * 0.5;

          return (
            <ChangeParticle
              key={`change-particle-globe-${index}`}
              position={[x, y, z]}
            />
          );
        });
      }, [positions])}
    </group>
  );
};
