import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Entity } from '../../../types/entity';
import { GlobeScene } from './GlobeScene';
import { OrbitControls } from '@react-three/drei';

interface EntityPosition {
  entity_id: string;
  entity_type: string;
  name: string;
  timeline_position: {
    x: number;
    y: number;
    z: number;
  };
  network_position: {
    x: number;
    y: number;
    z: number;
  };
  change_particles: Array<{
    x: number;
    y: number;
    z: number;
  }>;
}

interface Globe3DProps {
  entities: Entity[];
  positions: EntityPosition[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

export const Globe3D: React.FC<Globe3DProps> = ({
  entities,
  positions,
  selectedEntity,
  onEntitySelect,
}) => {
  return (
    <div className="w-full h-full">
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
            positions={positions}
            selectedEntity={selectedEntity}
            onEntitySelect={onEntitySelect}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
