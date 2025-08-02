import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MatrixScene } from './MatrixScene';
import { Entity, EntityPosition } from '../../../types/entity';
import {
  CANVAS_STYLE,
  MOBILE_CONTROLS_CONFIG,
  CONTROLS_CONFIG,
  MOBILE_MATRIX_CAMERA_CONFIG,
} from '../../../constants/visualization';
import { useIsMobile } from '../../../hooks/useRealTimeData';

interface Matrix3DProps {
  entities: Entity[];
  positions?: EntityPosition[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

export const Matrix3D: React.FC<Matrix3DProps> = ({
  entities,
  positions,
  selectedEntity,
  onEntitySelect,
}) => {
  const isMobile = useIsMobile();
  const controlsConfig = isMobile ? MOBILE_CONTROLS_CONFIG : CONTROLS_CONFIG;
  const cameraConfig = isMobile
    ? MOBILE_MATRIX_CAMERA_CONFIG
    : { position: [0, 3, 15] as [number, number, number], fov: 50 };

  console.log('Matrix3D - rendering with:', {
    entities: entities.length,
    positions: positions?.length,
  });

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas camera={cameraConfig} style={CANVAS_STYLE}>
        <MatrixScene
          entities={entities}
          positions={positions}
          selectedEntity={selectedEntity}
          onEntitySelect={onEntitySelect}
        />
        <OrbitControls {...controlsConfig} target={[0, 3, 0]} />
      </Canvas>
    </div>
  );
};
