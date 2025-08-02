import React from 'react';
import { Entity } from '../../../types/entity';
import { Text } from '@react-three/drei';

interface MatrixNodeProps {
  entity: Entity;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}

const getThreatColor = (entity: Entity, position: [number, number, number]) => {
  if (entity.type !== 'Threat') return '#4ecdc4';

  // Use Y coordinate (severity) for color
  const y = position[1];
  if (y >= 5) return '#ff4444'; // Critical (red)
  if (y >= 3) return '#ff6b35'; // High (orange)
  if (y >= 1) return '#ffa726'; // Medium (yellow-orange)
  return '#ffeb3b'; // Low (yellow)
};

const getThreatSize = (entity: Entity, position: [number, number, number]) => {
  if (entity.type !== 'Threat') return 0.4;

  // Use Z coordinate (threat score) for size
  const z = position[2];
  const normalizedZ = (z + 3) / 6; // Convert from -3 to +3 range to 0-1
  return Math.max(0.3, Math.min(0.8, 0.3 + normalizedZ * 0.5));
};

const getThreatLabel = (entity: Entity, position: [number, number, number]) => {
  if (entity.type !== 'Threat') return entity.name;

  // Use coordinates for meaningful labels
  const [x, y, z] = position;

  // Y coordinate = severity
  let severity = 'low';
  if (y >= 5) severity = 'critical';
  else if (y >= 3) severity = 'high';
  else if (y >= 1) severity = 'medium';

  // X coordinate = detection count (rough mapping)
  let detectionLevel = 'low';
  if (x >= 2) detectionLevel = 'high';
  else if (x >= -1) detectionLevel = 'medium';

  // Z coordinate = threat score percentage
  const threatScorePercent = Math.round(((z + 3) / 6) * 100);

  return `${entity.name}\n${severity} | ${threatScorePercent}%\n${detectionLevel} detections`;
};

export const MatrixNode: React.FC<MatrixNodeProps> = ({
  entity,
  position,
  isSelected,
  onClick,
}) => {
  const color = getThreatColor(entity, position);
  const size = getThreatSize(entity, position);
  const label = getThreatLabel(entity, position);

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
