import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Entity } from '../../types/entity';
import { EntityChange } from '../../types/api';

interface Globe3DProps {
  entities: Entity[];
  changes: EntityChange[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

export const Globe3D: React.FC<Globe3DProps> = ({
  entities,
  changes,
  selectedEntity,
  onEntitySelect,
}) => {
  console.log('Globe3D render:', {
    entities: entities.length,
    changes: changes.length,
  });

  return (
    <div className="w-full h-full bg-black">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'linear-gradient(to bottom, #0f0f23, #1a1a2e)' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={20}
            minDistance={3}
          />

          {/* 3D Globe */}
          <GlobeScene
            entities={entities}
            changes={changes}
            selectedEntity={selectedEntity}
            onEntitySelect={onEntitySelect}
          />

          {/* Stats for performance monitoring */}
          <Stats />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Globe Scene Component
const GlobeScene: React.FC<{
  entities: Entity[];
  changes: EntityChange[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}> = ({ entities, changes, selectedEntity, onEntitySelect }) => {
  console.log('GlobeScene render:', {
    entities: entities.length,
    changes: changes.length,
  });

  return (
    <group>
      {/* Globe surface */}
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

      {/* Globe grid lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={`lat-${i}`} rotation={[0, (i / 8) * Math.PI, 0]}>
          <ringGeometry args={[3, 3.01, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
        </mesh>
      ))}

      {/* Entity nodes positioned on globe surface */}
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

      {/* Change particles orbiting around the globe */}
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

// Globe Node Component
const GlobeNode: React.FC<{
  entity: Entity;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}> = ({ position, isSelected, onClick }) => {
  return (
    <group position={position}>
      <mesh onClick={onClick}>
        <sphereGeometry args={[isSelected ? 0.3 : 0.2, 16, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#ff6b6b' : '#4ecdc4'}
          emissive={isSelected ? '#ff6b6b' : '#4ecdc4'}
          emissiveIntensity={isSelected ? 0.8 : 0.4}
        />
      </mesh>
    </group>
  );
};

// Change Particle Component
const ChangeParticle: React.FC<{
  change: EntityChange;
  position: [number, number, number];
}> = ({ position }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial
        color="#ffd93d"
        emissive="#ffd93d"
        emissiveIntensity={0.6}
      />
    </mesh>
  );
};
