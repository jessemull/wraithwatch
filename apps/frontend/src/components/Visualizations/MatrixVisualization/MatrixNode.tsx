import React, { useMemo, useCallback } from 'react';
import { Entity } from '../../../types/entity';
import { Text } from '@react-three/drei';
import { MatrixNodeProps } from '../../../types/visualization';
import {
  THREAT_SEVERITY_CONFIG,
  MATRIX_NODE_CONFIG,
} from '../../../constants/visualization';

const getThreatColor = (entity: Entity, position: [number, number, number]) => {
  if (entity.type !== 'Threat') return MATRIX_NODE_CONFIG.defaultColor;

  const y = position[1];
  const { critical, high, medium, low } = THREAT_SEVERITY_CONFIG;

  if (y >= critical.threshold) return critical.color;
  if (y >= high.threshold) return high.color;
  if (y >= medium.threshold) return medium.color;
  return low.color;
};

const getThreatSize = (entity: Entity, position: [number, number, number]) => {
  if (entity.type !== 'Threat') return MATRIX_NODE_CONFIG.sizeRange.base;

  const z = position[2];
  const { zRange } = MATRIX_NODE_CONFIG.coordinateMapping;
  const normalizedZ = (z - zRange.min) / (zRange.max - zRange.min);
  const size =
    MATRIX_NODE_CONFIG.sizeRange.min +
    normalizedZ *
      (MATRIX_NODE_CONFIG.sizeRange.max - MATRIX_NODE_CONFIG.sizeRange.min);

  return Math.max(
    MATRIX_NODE_CONFIG.sizeRange.min,
    Math.min(MATRIX_NODE_CONFIG.sizeRange.max, size)
  );
};

const getThreatLabel = (entity: Entity, position: [number, number, number]) => {
  if (entity.type !== 'Threat') return entity.name;

  const [x, y, z] = position;
  const { critical, high, medium, low } = THREAT_SEVERITY_CONFIG;

  // Y coordinate = severity
  let severity: string = low.label;
  if (y >= critical.threshold) severity = critical.label;
  else if (y >= high.threshold) severity = high.label;
  else if (y >= medium.threshold) severity = medium.label;

  // X coordinate = detection count (rough mapping)
  let detectionLevel = 'low';
  if (x >= 2) detectionLevel = 'high';
  else if (x >= -1) detectionLevel = 'medium';

  // Z coordinate = threat score percentage
  const { zRange } = MATRIX_NODE_CONFIG.coordinateMapping;
  const threatScorePercent = Math.round(
    ((z - zRange.min) / (zRange.max - zRange.min)) * 100
  );

  return `${entity.name}\n${severity} | ${threatScorePercent}%\n${detectionLevel} detections`;
};

export const MatrixNode: React.FC<MatrixNodeProps> = ({
  entity,
  position,
  isSelected,
  onClick,
}) => {
  const color = useMemo(
    () => getThreatColor(entity, position),
    [entity, position]
  );
  const size = useMemo(
    () => getThreatSize(entity, position),
    [entity, position]
  );
  const label = useMemo(
    () => getThreatLabel(entity, position),
    [entity, position]
  );

  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <group position={position}>
      <mesh onClick={handleClick}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.8 : 0.3}
          transparent={true}
          opacity={0.8}
        />
      </mesh>

      <Text
        position={[0, size + MATRIX_NODE_CONFIG.label.offset, 0]}
        fontSize={MATRIX_NODE_CONFIG.label.fontSize}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={MATRIX_NODE_CONFIG.label.maxWidth}
        textAlign="center"
      >
        {label}
      </Text>
    </group>
  );
};
