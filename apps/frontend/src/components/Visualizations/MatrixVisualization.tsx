import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Entity } from '../../types/entity';
import { EntityChange } from '../../types/api';

interface Matrix3DProps {
  entities: Entity[];
  changes: EntityChange[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

export const Matrix3D: React.FC<Matrix3DProps> = ({
  entities,
  changes,
  selectedEntity,
  onEntitySelect,
}) => {
  console.log('Matrix3D render:', {
    entities: entities.length,
    changes: changes.length,
  });

  return (
    <div className="w-full h-full bg-black">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
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
            maxDistance={30}
            minDistance={5}
          />

          {/* 3D Matrix */}
          <MatrixScene
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

// Matrix Scene Component
const MatrixScene: React.FC<{
  entities: Entity[];
  changes: EntityChange[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}> = ({ entities, changes, selectedEntity, onEntitySelect }) => {
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

// Matrix Node Component
const MatrixNode: React.FC<{
  entity: Entity;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}> = ({ position, isSelected, onClick }) => {
  return (
    <group position={position}>
      <mesh onClick={onClick}>
        <boxGeometry
          args={[
            isSelected ? 0.8 : 0.6,
            isSelected ? 0.8 : 0.6,
            isSelected ? 0.8 : 0.6,
          ]}
        />
        <meshStandardMaterial
          color={isSelected ? '#ff6b6b' : '#4ecdc4'}
          emissive={isSelected ? '#ff6b6b' : '#4ecdc4'}
          emissiveIntensity={isSelected ? 0.8 : 0.4}
        />
      </mesh>
    </group>
  );
};

// Data Flow Line Component
const DataFlowLine: React.FC<{
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
        color="#00ff00"
        emissive="#00ff00"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

// Data Particle Component
const DataParticle: React.FC<{
  change: EntityChange;
  position: [number, number, number];
}> = ({ position }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial
        color="#00ff00"
        emissive="#00ff00"
        emissiveIntensity={0.8}
      />
    </mesh>
  );
};
