import React from 'react';
import { Entity } from '../../../types/entity';

interface GlobeNodeProps {
  entity: Entity;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}

export const GlobeNode: React.FC<GlobeNodeProps> = ({
  position,
  isSelected,
  onClick,
}) => {
  return (
    <group position={position}>
      <mesh onClick={onClick}>
        <sphereGeometry args={[isSelected ? 0.3 : 0.2, 16, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#ff6b6b' : '#4ecdc4'}
          emissive={isSelected ? '#ff6b6b' : '#4ecdc4'}
          emissiveIntensity={isSelected ? 0.8 : 0.4}
        />
      </mesh>
    </group>
  );
};
