import React, { useMemo } from 'react';
import { Entity } from '../../../types/entity';
import { Text } from '@react-three/drei';

interface NetworkNodeProps {
  entity: Entity;
  isSelected: boolean;
  onClick: () => void;
  position: [number, number, number];
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

  const isThreat = entity.type === 'Threat';

  return (
    <group position={position}>
      {/* Halo effect for threats */}
      {isThreat && (
        <mesh>
          <sphereGeometry args={[nodeStyle.size + 0.1, 32, 32]} />
          <meshStandardMaterial
            color="#ff6b6b"
            transparent
            opacity={0.3}
            emissive="#ff6b6b"
            emissiveIntensity={0.2}
          />
        </mesh>
      )}
      
      {/* Main spherical node */}
      <mesh onClick={onClick}>
        <sphereGeometry args={[nodeStyle.size, 32, 32]} />
        <meshStandardMaterial
          color={nodeStyle.color}
          emissive={nodeStyle.color}
          emissiveIntensity={nodeStyle.emissiveIntensity}
          metalness={0.4}
          roughness={0.1}
        />
      </mesh>
      
      {/* Additional highlight for threats */}
      {isThreat && (
        <mesh>
          <sphereGeometry args={[nodeStyle.size + 0.05, 32, 32]} />
          <meshStandardMaterial
            color="#ff6b6b"
            transparent
            opacity={0.2}
            emissive="#ff6b6b"
            emissiveIntensity={0.1}
          />
        </mesh>
      )}
      
      {/* Entity label */}
      <Text
        position={[0, nodeStyle.size + 0.3, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="bottom"
        maxWidth={2}
        textAlign="center"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {entity.name}
      </Text>
    </group>
  );
};
