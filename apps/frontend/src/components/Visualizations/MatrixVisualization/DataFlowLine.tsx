import React from 'react';

interface DataFlowLineProps {
  start: [number, number, number];
  end: [number, number, number];
}

export const DataFlowLine: React.FC<DataFlowLineProps> = ({ start, end }) => {
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

  return (
    <mesh position={midPoint}>
      <cylinderGeometry args={[0.02, 0.02, distance, 8]} />
      <meshStandardMaterial
        color="#00ff00"
        emissive="#00ff00"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};
