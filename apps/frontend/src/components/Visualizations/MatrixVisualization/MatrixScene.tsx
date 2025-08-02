import React from 'react';
import { Entity } from '../../../types/entity';
import { MatrixNode } from './MatrixNode';
import { Text } from '@react-three/drei';

interface MatrixSceneProps {
  entities: Entity[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

const getThreatPosition = (entity: Entity) => {
  if (entity.type !== 'Threat') {
    return null; // Don't position non-threat entities
  }

  const severity = entity.properties?.severity?.currentValue;
  const detectionCount = Number(entity.properties?.detection_count?.currentValue) || 0;
  const threatScore = Number(entity.properties?.threat_score?.currentValue) || 0;

  // Y-axis: Severity (bottom to top) - moved up by 2 units
  let y = 0;
  switch (severity) {
    case 'critical':
      y = 6;
      break;
    case 'high':
      y = 4;
      break;
    case 'medium':
      y = 2;
      break;
    case 'low':
      y = 0;
      break;
    default:
      y = 2;
  }

  // X-axis: Detection Count (left to right) - 0-100 range
  const x = Math.max(-4, Math.min(4, (detectionCount / 100) * 8 - 4)); // Scale detection count 0-100 to -4 to +4

  // Z-axis: Threat Score (back to front) - convert 0-1 to 0-100 scale
  const threatScorePercent = threatScore * 100; // Convert 0-1 to 0-100
  const z = (threatScorePercent / 100) * 6 - 3; // Scale from -3 to +3 for 0-100 range

  return [x, y, z] as [number, number, number];
};

export const MatrixScene: React.FC<MatrixSceneProps> = ({
  entities,
  selectedEntity,
  onEntitySelect,
}) => {
  const threatEntities = entities.filter(e => e.type === 'Threat');

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* 3D Grid Lines */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[12, 0.05, 8]} />
        <meshStandardMaterial color="#333333" transparent opacity={0.2} />
      </mesh>

      {/* X-axis grid lines */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={`x-grid-${i}`} position={[0, (i - 1) * 2, 0]}>
          <boxGeometry args={[12, 0.02, 0.02]} />
          <meshStandardMaterial color="#444444" transparent opacity={0.3} />
        </mesh>
      ))}

      {/* Z-axis grid lines */}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={`z-grid-${i}`} position={[0, 2, (i - 3) * 2]}>
          <boxGeometry args={[0.02, 8, 0.02]} />
          <meshStandardMaterial color="#444444" transparent opacity={0.3} />
        </mesh>
      ))}

      {/* Axis Labels */}
      <Text
        position={[0, 8, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        SEVERITY
      </Text>
      
      <Text
        position={[-8, 2, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, -Math.PI / 2]}
      >
        DETECTION COUNT
      </Text>

      <Text
        position={[0, 2, 6]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, 0]}
      >
        THREAT SCORE
      </Text>

      {/* Severity Labels */}
      <Text position={[7, 6, 0]} fontSize={0.25} color="#ff4444" anchorX="left" anchorY="middle">
        Critical
      </Text>
      <Text position={[7, 4, 0]} fontSize={0.25} color="#ff6b35" anchorX="left" anchorY="middle">
        High
      </Text>
      <Text position={[7, 2, 0]} fontSize={0.25} color="#ffa726" anchorX="left" anchorY="middle">
        Medium
      </Text>
      <Text position={[7, 0, 0]} fontSize={0.25} color="#ffeb3b" anchorX="left" anchorY="middle">
        Low
      </Text>

      {/* Detection Count Labels */}
      <Text position={[-4, -2, 0]} fontSize={0.25} color="#ffffff" anchorX="center" anchorY="middle">
        Low (0-33)
      </Text>
      <Text position={[0, -2, 0]} fontSize={0.25} color="#ffffff" anchorX="center" anchorY="middle">
        Medium (34-66)
      </Text>
      <Text position={[4, -2, 0]} fontSize={0.25} color="#ffffff" anchorX="center" anchorY="middle">
        High (67-100)
      </Text>

      {/* Threat Score Labels */}
      <Text position={[0, -2, -3]} fontSize={0.25} color="#ffffff" anchorX="center" anchorY="middle">
        Low Score (0%)
      </Text>
      <Text position={[0, -2, 0]} fontSize={0.25} color="#ffffff" anchorX="center" anchorY="middle">
        Medium Score (50%)
      </Text>
      <Text position={[0, -2, 3]} fontSize={0.25} color="#ffffff" anchorX="center" anchorY="middle">
        High Score (100%)
      </Text>

      {/* Threat Entities Only */}
      {threatEntities.map((entity) => {
        const position = getThreatPosition(entity);
        if (!position) return null;
        
        return (
          <MatrixNode
            key={entity.id}
            entity={entity}
            position={position}
            isSelected={selectedEntity?.id === entity.id}
            onClick={() => onEntitySelect?.(entity)}
          />
        );
      })}
    </>
  );
};
