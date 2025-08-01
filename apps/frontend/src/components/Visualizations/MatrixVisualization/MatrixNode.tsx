import React from 'react';
import { Entity } from '../../../types/entity';

interface MatrixNodeProps {
  entity: Entity;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}

export const MatrixNode: React.FC<MatrixNodeProps> = ({
  position,
  isSelected,
  onClick,
}) => {
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
