import React, { useMemo } from 'react';
import { MatrixNode } from './MatrixNode';
import { Text } from '@react-three/drei';
import { MatrixSceneProps } from '../../../types/visualization';
import { MATRIX_CONFIG } from '../../../constants/visualization';

export const MatrixScene: React.FC<MatrixSceneProps> = ({
  entities,
  positions,
  selectedEntity,
  onEntitySelect,
}) => {
  const threatEntities = useMemo(
    () => entities.filter(e => e.type === 'Threat'),
    [entities]
  );

  const gridElements = useMemo(() => {
    const { grid, materials } = MATRIX_CONFIG;
    const elements: React.ReactElement[] = [];

    // Base plane
    elements.push(
      <mesh key="base-plane" position={[0, grid.baseY, 0]}>
        <boxGeometry args={[12, 0.05, 8]} />
        <meshStandardMaterial
          color={materials.base.color}
          transparent={materials.base.transparent}
          opacity={materials.base.opacity}
        />
      </mesh>
    );

    // X grid lines
    for (let i = 0; i < grid.xLines; i++) {
      elements.push(
        <mesh key={`x-grid-${i}`} position={[0, (i - 1) * grid.spacing, 0]}>
          <boxGeometry args={[12, 0.02, 0.02]} />
          <meshStandardMaterial
            color={materials.grid.color}
            transparent={materials.grid.transparent}
            opacity={materials.grid.opacity}
          />
        </mesh>
      );
    }

    // Z grid lines
    for (let i = 0; i < grid.zLines; i++) {
      elements.push(
        <mesh
          key={`z-grid-${i}`}
          position={[0, grid.baseY, (i - 3) * grid.spacing]}
        >
          <boxGeometry args={[0.02, 8, 0.02]} />
          <meshStandardMaterial
            color={materials.grid.color}
            transparent={materials.grid.transparent}
            opacity={materials.grid.opacity}
          />
        </mesh>
      );
    }

    return elements;
  }, []);

  const textElements = useMemo(() => {
    const { text } = MATRIX_CONFIG;
    const elements: React.ReactElement[] = [];

    // Main labels
    text.mainLabels.forEach((label, index) => {
      elements.push(
        <Text
          key={`main-label-${index}`}
          position={label.position}
          fontSize={label.fontSize}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          rotation={
            (label as { rotation?: [number, number, number] }).rotation || [
              0, 0, 0,
            ]
          }
        >
          {label.text}
        </Text>
      );
    });

    // Severity labels
    text.severityLabels.forEach((label, index) => {
      elements.push(
        <Text
          key={`severity-label-${index}`}
          position={label.position}
          fontSize={label.fontSize}
          color={label.color}
          anchorX="left"
          anchorY="middle"
        >
          {label.text}
        </Text>
      );
    });

    // Axis labels
    text.axisLabels.forEach((label, index) => {
      elements.push(
        <Text
          key={`axis-label-${index}`}
          position={label.position}
          fontSize={label.fontSize}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {label.text}
        </Text>
      );
    });

    return elements;
  }, []);

  const lightingElements = useMemo(() => {
    const { lighting } = MATRIX_CONFIG;
    return (
      <>
        <ambientLight intensity={lighting.ambient.intensity} />
        {lighting.pointLights.map((light, index) => (
          <pointLight
            key={`point-light-${index}`}
            position={light.position}
            intensity={light.intensity}
          />
        ))}
      </>
    );
  }, []);

  return (
    <>
      {lightingElements}
      {gridElements}
      {textElements}
      {threatEntities.map(entity => {
        // Only use server-calculated positions...

        if (!positions) {
          return null;
        }

        const positionData = positions.find(p => p.entity_id === entity.id);

        if (!positionData?.matrix_position) {
          return null;
        }

        const position: [number, number, number] = [
          positionData.matrix_position.x,
          positionData.matrix_position.y,
          positionData.matrix_position.z,
        ];

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
