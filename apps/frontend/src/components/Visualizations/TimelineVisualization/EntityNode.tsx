import React from 'react';
import { Entity } from '../../../types/entity';
import { Text } from '@react-three/drei';

interface EntityNodeProps {
  entity: Entity;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}

export const EntityNode: React.FC<EntityNodeProps> = ({
  entity,
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

      {/* Entity label */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {entity.name}
      </Text>
    </group>
  );
};
