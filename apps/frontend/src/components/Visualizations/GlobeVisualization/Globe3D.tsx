import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Entity } from '../../../types/entity';
import { EntityChange } from '../../../types/api';
import { GlobeScene } from './GlobeScene';
import { OrbitControls, Stats } from '@react-three/drei';

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
  return (
    <div className="w-full h-full bg-black">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'linear-gradient(to bottom, #0f0f23, #1a1a2e)' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={20}
            minDistance={3}
          />
          <GlobeScene
            entities={entities}
            changes={changes}
            selectedEntity={selectedEntity}
            onEntitySelect={onEntitySelect}
          />
          <Stats />
        </Suspense>
      </Canvas>
    </div>
  );
};
