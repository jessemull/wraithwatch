import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Entity } from '../../types/entity';
import { EntityChange } from '../../types/api';

interface NetworkGraph3DProps {
  entities: Entity[];
  changes: EntityChange[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

export const NetworkGraph3D: React.FC<NetworkGraph3DProps> = ({
  entities,
  changes,
  selectedEntity,
  onEntitySelect,
}) => {
  console.log('NetworkGraph3D render:', {
    entities: entities.length,
    changes: changes.length,
  });

  return (
    <div className="w-full h-full bg-black">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
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
            maxDistance={50}
            minDistance={5}
          />

          {/* 3D Network Graph */}
          <NetworkScene
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

// Network Scene Component
const NetworkScene: React.FC<{
  entities: Entity[];
  changes: EntityChange[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}> = ({ entities, changes, selectedEntity, onEntitySelect }) => {
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

// Network Node Component
const NetworkNode: React.FC<{
  entity: Entity;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}> = ({ position, isSelected, onClick }) => {
  return (
    <group position={position}>
      <mesh onClick={onClick}>
        <sphereGeometry args={[isSelected ? 0.4 : 0.3, 16, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#ff6b6b' : '#4ecdc4'}
          emissive={isSelected ? '#ff6b6b' : '#4ecdc4'}
          emissiveIntensity={isSelected ? 0.8 : 0.4}
        />
      </mesh>
    </group>
  );
};

// Connection Line Component
const ConnectionLine: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
}> = ({ start, end }) => {
  const midPoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ];

  const distance = Math.sqrt(
    Math.pow(end[0] - start[0], 2) +
      Math.pow(end[1] - start[1], 2) +
      Math.pow(end[2] - start[2], 2)
  );

  return (
    <mesh position={midPoint}>
      <cylinderGeometry args={[0.02, 0.02, distance, 8]} />
      <meshStandardMaterial
        color="#6c5ce7"
        emissive="#6c5ce7"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
};

// Change Particle Component
const ChangeParticle: React.FC<{
  change: EntityChange;
  position: [number, number, number];
}> = ({ position }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshStandardMaterial
        color="#ffd93d"
        emissive="#ffd93d"
        emissiveIntensity={0.6}
      />
    </mesh>
  );
};
