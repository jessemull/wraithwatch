import React from 'react';

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  start,
  end,
}) => {
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
        color="#6c5ce7"
        emissive="#6c5ce7"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
};
