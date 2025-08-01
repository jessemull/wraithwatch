import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Entity } from '../../../types/entity';
import { EntityChange } from '../../../types/api';
import { NetworkScene } from './NetworkScene';

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
