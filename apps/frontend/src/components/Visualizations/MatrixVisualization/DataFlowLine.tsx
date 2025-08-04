import React, { useMemo } from 'react';
import { DataFlowLineProps } from '../../../types/visualization';
import { DATA_FLOW_LINE_CONFIG } from '../../../constants/visualization';

export const DataFlowLine: React.FC<DataFlowLineProps> = ({ start, end }) => {
  const { geometry, material } = DATA_FLOW_LINE_CONFIG;

  const lineData = useMemo(() => {
    const midPoint: [number, number, number] = [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2,
    ];

    const distance = Math.sqrt(
      Math.pow(end[0] - start[0], 2) +
        Math.pow(end[1] - start[1], 2) +
        Math.pow(end[2] - start[2], 2)
    );

    return { midPoint, distance };
  }, [start, end]);

  return (
    <mesh position={lineData.midPoint}>
      <cylinderGeometry
        args={[
          geometry.radius,
          geometry.radius,
          lineData.distance,
          geometry.segments,
        ]}
      />
      <meshStandardMaterial
        color={material.color}
        emissive={material.emissive}
        emissiveIntensity={material.emissiveIntensity}
      />
    </mesh>
  );
};
