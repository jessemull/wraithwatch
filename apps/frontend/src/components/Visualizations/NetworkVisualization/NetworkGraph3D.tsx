import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Entity } from '../../../types/entity';
import { EntityChange } from '../../../types/api';
import { NetworkScene } from './NetworkScene';
import { OrbitControls } from '@react-three/drei';
import { CANVAS_STYLE } from '../../../constants/visualization';

interface NetworkGraph3DProps {
  changes: EntityChange[];
  entities: Entity[];
  onEntitySelect?: (entity: Entity) => void;
  selectedEntity?: Entity;
}

export const NetworkGraph3D: React.FC<NetworkGraph3DProps> = ({
  entities,
  changes,
  selectedEntity,
  onEntitySelect,
}) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={CANVAS_STYLE}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={50}
            minDistance={5}
          />
          <NetworkScene
            entities={entities}
            changes={changes}
            selectedEntity={selectedEntity}
            onEntitySelect={onEntitySelect}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
