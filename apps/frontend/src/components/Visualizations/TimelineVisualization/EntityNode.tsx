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
  // Different visual styles based on entity type
  const getEntityStyle = () => {
    if (entity.type === 'Threat') {
      return {
        color: isSelected ? '#ff4444' : '#ff6b6b',
        emissive: isSelected ? '#ff4444' : '#ff6b6b',
        emissiveIntensity: isSelected ? 1.0 : 0.8,
        size: isSelected ? 0.5 : 0.4,
        textColor: '#ffffff',
        pulse: true,
      };
    } else if (entity.type === 'AI_Agent') {
      return {
        color: isSelected ? '#4ecdc4' : '#4ecdc4',
        emissive: isSelected ? '#4ecdc4' : '#4ecdc4',
        emissiveIntensity: isSelected ? 0.8 : 0.4,
        size: isSelected ? 0.4 : 0.3,
        textColor: '#ffffff',
        pulse: false,
      };
    } else if (entity.type === 'System') {
      return {
        color: isSelected ? '#45b7d1' : '#45b7d1',
        emissive: isSelected ? '#45b7d1' : '#45b7d1',
        emissiveIntensity: isSelected ? 0.8 : 0.4,
        size: isSelected ? 0.4 : 0.3,
        textColor: '#ffffff',
        pulse: false,
      };
    } else if (entity.type === 'Network_Node') {
      return {
        color: isSelected ? '#96ceb4' : '#96ceb4',
        emissive: isSelected ? '#96ceb4' : '#96ceb4',
        emissiveIntensity: isSelected ? 0.8 : 0.4,
        size: isSelected ? 0.4 : 0.3,
        textColor: '#ffffff',
        pulse: false,
      };
    } else if (entity.type === 'User') {
      return {
        color: isSelected ? '#feca57' : '#feca57',
        emissive: isSelected ? '#feca57' : '#feca57',
        emissiveIntensity: isSelected ? 0.8 : 0.4,
        size: isSelected ? 0.4 : 0.3,
        textColor: '#000000',
        pulse: false,
      };
    }

    // Default style
    return {
      color: isSelected ? '#ff6b6b' : '#4ecdc4',
      emissive: isSelected ? '#ff6b6b' : '#4ecdc4',
      emissiveIntensity: isSelected ? 0.8 : 0.4,
      size: isSelected ? 0.4 : 0.3,
      textColor: '#ffffff',
      pulse: false,
    };
  };

  const style = getEntityStyle();

  return (
    <group position={position}>
      <mesh onClick={onClick}>
        <sphereGeometry args={[style.size, 16, 16]} />
        <meshStandardMaterial
          color={style.color}
          emissive={style.emissive}
          emissiveIntensity={style.emissiveIntensity}
        />
      </mesh>
      {style.pulse && (
        <mesh>
          <sphereGeometry args={[style.size * 1.5, 16, 16]} />
          <meshStandardMaterial
            color={style.color}
            transparent
            opacity={0.3}
            emissive={style.emissive}
            emissiveIntensity={0.2}
          />
        </mesh>
      )}
      <Text
        position={[0, style.size + 0.2, 0]}
        fontSize={0.3}
        color={style.textColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
      >
        {entity.name}
      </Text>
    </group>
  );
};
