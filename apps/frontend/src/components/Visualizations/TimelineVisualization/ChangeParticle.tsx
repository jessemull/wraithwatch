import React from 'react';
import { PARTICLE_STYLES } from '../../../constants/visualization';

interface ChangeParticleProps {
  position: [number, number, number];
}

export const ChangeParticle: React.FC<ChangeParticleProps> = ({ position }) => {
  const particleStyle = PARTICLE_STYLES.change;
  return (
    <mesh position={position}>
      <sphereGeometry args={[particleStyle.size, 8, 8]} />
      <meshStandardMaterial
        color={particleStyle.color}
        emissive={particleStyle.emissive}
        emissiveIntensity={particleStyle.emissiveIntensity}
      />
    </mesh>
  );
};
