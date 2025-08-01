import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, Text } from '@react-three/drei';
import { Entity } from '../../types/entity';
import { EntityChange } from '../../types/api';

interface TimelineVisualizationProps {
  entities: Entity[];
  changes: EntityChange[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

export const TimelineVisualization: React.FC<TimelineVisualizationProps> = ({
  entities,
  changes,
  selectedEntity,
  onEntitySelect,
}) => {
  console.log('TimelineVisualization render:', {
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

          {/* 3D Timeline Visualization */}
          <TimelineScene
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

// Timeline Scene Component
const TimelineScene: React.FC<{
  entities: Entity[];
  changes: EntityChange[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}> = ({ entities, changes, selectedEntity, onEntitySelect }) => {
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

// Entity Node Component
const EntityNode: React.FC<{
  entity: Entity;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}> = ({ entity, position, isSelected, onClick }) => {
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

      {/* Entity label */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {entity.name}
      </Text>
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
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial
        color="#ffd93d"
        emissive="#ffd93d"
        emissiveIntensity={0.6}
      />
    </mesh>
  );
};
