import React from 'react';
import { Entity } from '../../../types/entity';

interface NetworkNodeProps {
  entity: Entity;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}

export const NetworkNode: React.FC<NetworkNodeProps> = ({
  position,
  isSelected,
  onClick,
}) => {
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
    </group>
  );
};
