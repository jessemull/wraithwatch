import React from 'react';

interface DataParticleProps {
  position: [number, number, number];
}

export const DataParticle: React.FC<DataParticleProps> = ({ position }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial
        color="#00ff00"
        emissive="#00ff00"
        emissiveIntensity={0.8}
      />
    </mesh>
  );
};
