import React, { useMemo } from 'react';
import { Entity } from '../../../types/entity';

interface NetworkNodeProps {
  entity: Entity;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}

export const NetworkNode: React.FC<NetworkNodeProps> = ({
  entity,
  position,
  isSelected,
  onClick,
}) => {
  const nodeStyle = useMemo(() => {
    const baseSize = isSelected ? 0.4 : 0.3;
    const baseIntensity = isSelected ? 0.8 : 0.4;

    // Color based on entity type
    switch (entity.type) {
      case 'System':
        return {
          color: isSelected ? '#45b7d1' : '#45b7d1',
          size: baseSize,
          emissiveIntensity: baseIntensity,
        };
      case 'User':
        return {
          color: isSelected ? '#feca57' : '#feca57',
          size: baseSize,
          emissiveIntensity: baseIntensity,
        };
      case 'AI_Agent':
        return {
          color: isSelected ? '#4ecdc4' : '#4ecdc4',
          size: baseSize,
          emissiveIntensity: baseIntensity,
        };
      case 'Threat':
        return {
          color: isSelected ? '#ff6b6b' : '#ff6b6b',
          size: baseSize,
          emissiveIntensity: baseIntensity,
        };
      case 'Network_Node':
        return {
          color: isSelected ? '#96ceb4' : '#96ceb4',
          size: baseSize,
          emissiveIntensity: baseIntensity,
        };
      default:
        return {
          color: isSelected ? '#ff6b6b' : '#4ecdc4',
          size: baseSize,
          emissiveIntensity: baseIntensity,
        };
    }
  }, [entity.type, isSelected]);

  return (
    <group position={position}>
      <mesh onClick={onClick}>
        <sphereGeometry args={[nodeStyle.size, 16, 16]} />
        <meshStandardMaterial
          color={nodeStyle.color}
          emissive={nodeStyle.color}
          emissiveIntensity={nodeStyle.emissiveIntensity}
        />
      </mesh>
    </group>
  );
};
