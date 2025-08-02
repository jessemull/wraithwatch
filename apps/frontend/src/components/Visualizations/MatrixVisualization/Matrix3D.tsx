import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MatrixScene } from './MatrixScene';
import { Entity } from '../../../types/entity';
import { CANVAS_STYLE } from '../../../constants/visualization';

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
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 3, 15], fov: 50 }}
        style={CANVAS_STYLE}
      >
        <MatrixScene
          entities={entities}
          selectedEntity={selectedEntity}
          onEntitySelect={onEntitySelect}
        />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
          target={[0, 3, 0]}
        />
      </Canvas>
    </div>
  );
};
