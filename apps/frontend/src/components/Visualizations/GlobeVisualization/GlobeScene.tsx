import React from 'react';
import { Entity } from '../../../types/entity';
import { EntityChange } from '../../../types/api';
import { GlobeNode } from './GlobeNode';
import { ChangeParticle } from './ChangeParticle';

interface GlobeSceneProps {
  entities: Entity[];
  changes: EntityChange[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

export const GlobeScene: React.FC<GlobeSceneProps> = ({
  entities,
  changes,
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
      {entities.map((entity, index) => {
        // Position entities on the globe surface
        const lat = (index / entities.length) * Math.PI - Math.PI / 2; // -90 to 90 degrees
        const lon = (index * 2.4) % (Math.PI * 2); // Distribute around longitude
        const radius = 3.2; // Slightly above globe surface

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
      })}
      {changes.slice(0, 40).map((change, index) => {
        const time = Date.now() * 0.001 + index * 0.1;
        const radius = 4 + Math.sin(time) * 0.5;
        const x = radius * Math.cos(time);
        const z = radius * Math.sin(time);
        const y = Math.sin(time * 2) * 0.5;

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
