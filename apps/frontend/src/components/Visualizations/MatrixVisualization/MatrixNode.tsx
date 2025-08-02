import React from 'react';
import { Entity } from '../../../types/entity';
import { Text } from '@react-three/drei';

interface MatrixNodeProps {
  entity: Entity;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}

const getThreatColor = (entity: Entity) => {
  if (entity.type !== 'Threat') return '#4ecdc4';
  
  const severity = entity.properties?.severity?.currentValue;
  
  if (severity === 'critical') return '#ff4444';
  if (severity === 'high') return '#ff6b35';
  if (severity === 'medium') return '#ffa726';
  return '#ffeb3b';
};

const getThreatSize = (entity: Entity) => {
  if (entity.type !== 'Threat') return 0.4;
  
  const threatScore = Number(entity.properties?.threat_score?.currentValue) || 0;
  return Math.max(0.3, Math.min(0.8, 0.3 + (threatScore * 0.5))); // 0-1 range
};

const getThreatLabel = (entity: Entity) => {
  if (entity.type !== 'Threat') return entity.name;
  
  const severity = entity.properties?.severity?.currentValue;
  const threatScore = Number(entity.properties?.threat_score?.currentValue) || 0;
  const detectionCount = entity.properties?.detection_count?.currentValue;
  
  // Convert threat score to percentage
  const threatScorePercent = Math.round(threatScore * 100);
  
  return `${entity.name}\n${severity || 'unknown'} | ${threatScorePercent}%\nDetections: ${detectionCount || 0}`;
};

export const MatrixNode: React.FC<MatrixNodeProps> = ({
  entity,
  position,
  isSelected,
  onClick,
}) => {
  const color = getThreatColor(entity);
  const size = getThreatSize(entity);
  const label = getThreatLabel(entity);

  return (
    <group position={position}>
      <mesh onClick={onClick}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.8 : 0.3}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      <Text
        position={[0, size + 0.4, 0]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        textAlign="center"
      >
        {label}
      </Text>
    </group>
  );
};
