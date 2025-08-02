import React from 'react';
import { Entity, EntityPosition } from '../../../types/entity';
import { MatrixNode } from './MatrixNode';
import { Text } from '@react-three/drei';

interface MatrixSceneProps {
  entities: Entity[];
  positions?: EntityPosition[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

export const MatrixScene: React.FC<MatrixSceneProps> = ({
  entities,
  positions,
  selectedEntity,
  onEntitySelect,
}) => {
  const threatEntities = entities.filter(e => e.type === 'Threat');

  // Debug logging
  console.log('MatrixScene - positions:', positions);
  console.log('MatrixScene - threatEntities:', threatEntities);
  if (positions && positions.length > 0) {
    console.log('MatrixScene - first position:', positions[0]);
    console.log(
      'MatrixScene - has matrix_position:',
      positions[0].matrix_position
    );
    console.log('MatrixScene - all position keys:', Object.keys(positions[0]));
  }

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
      <Text
        position={[7, 6, 0]}
        fontSize={0.25}
        color="#ff4444"
        anchorX="left"
        anchorY="middle"
      >
        Critical
      </Text>
      <Text
        position={[7, 4, 0]}
        fontSize={0.25}
        color="#ff6b35"
        anchorX="left"
        anchorY="middle"
      >
        High
      </Text>
      <Text
        position={[7, 2, 0]}
        fontSize={0.25}
        color="#ffa726"
        anchorX="left"
        anchorY="middle"
      >
        Medium
      </Text>
      <Text
        position={[7, 0, 0]}
        fontSize={0.25}
        color="#ffeb3b"
        anchorX="left"
        anchorY="middle"
      >
        Low
      </Text>

      {/* Detection Count Labels */}
      <Text
        position={[-4, -2, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Low (0-33)
      </Text>
      <Text
        position={[0, -2, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Medium (34-66)
      </Text>
      <Text
        position={[4, -2, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        High (67-100)
      </Text>

      {/* Threat Score Labels */}
      <Text
        position={[0, -2, -3]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Low Score (0%)
      </Text>
      <Text
        position={[0, -2, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Medium Score (50%)
      </Text>
      <Text
        position={[0, -2, 3]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        High Score (100%)
      </Text>

      {/* Threat Entities Only */}
      {threatEntities.map(entity => {
        // Only use server-calculated positions
        if (!positions) {
          console.log('MatrixScene - no positions available');
          return null;
        }

        const positionData = positions.find(p => p.entity_id === entity.id);
        console.log(
          'MatrixScene - entity:',
          entity.id,
          'positionData:',
          positionData
        );

        if (!positionData?.matrix_position) {
          console.log(
            'MatrixScene - no matrix_position for entity:',
            entity.id
          );
          return null;
        }

        const position: [number, number, number] = [
          positionData.matrix_position.x,
          positionData.matrix_position.y,
          positionData.matrix_position.z,
        ];

        console.log(
          'MatrixScene - rendering entity:',
          entity.id,
          'at position:',
          position
        );

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
