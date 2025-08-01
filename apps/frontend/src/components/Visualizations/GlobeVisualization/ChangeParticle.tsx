import React from 'react';
import { EntityChange } from '../../../types/api';

interface ChangeParticleProps {
  change: EntityChange;
  position: [number, number, number];
}

export const ChangeParticle: React.FC<ChangeParticleProps> = ({ position }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial
        color="#ffd93d"
        emissive="#ffd93d"
        emissiveIntensity={0.6}
      />
    </mesh>
  );
};
