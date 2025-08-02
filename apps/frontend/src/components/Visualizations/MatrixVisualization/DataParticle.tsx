import React from 'react';

interface DataParticleProps {
  position: [number, number, number];
  type?: 'threat' | 'ambient';
}

export const DataParticle: React.FC<DataParticleProps> = ({
  position,
  type = 'ambient',
}) => {
  const time = Date.now() * 0.001;
  const pulse = Math.sin(time * 3) * 0.5 + 0.5;

  const color = type === 'threat' ? '#ff4444' : '#ff6b35';
  const size = type === 'threat' ? 0.12 : 0.08;

  return (
    <mesh position={position}>
      <sphereGeometry args={[size * (1 + pulse * 0.3), 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8 + pulse * 0.4}
        transparent
        opacity={0.7 + pulse * 0.3}
      />
    </mesh>
  );
};
