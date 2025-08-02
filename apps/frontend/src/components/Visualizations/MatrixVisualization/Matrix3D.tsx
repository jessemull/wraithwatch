import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Entity } from '../../../types/entity';
import { MatrixScene } from './MatrixScene';
import { OrbitControls } from '@react-three/drei';

interface Matrix3DProps {
  entities: Entity[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

export const Matrix3D: React.FC<Matrix3DProps> = ({
  entities,
  selectedEntity,
  onEntitySelect,
}) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
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
            maxDistance={30}
            minDistance={5}
          />
          <MatrixScene
            entities={entities}
            selectedEntity={selectedEntity}
            onEntitySelect={onEntitySelect}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
