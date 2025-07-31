'use client';

import * as THREE from 'three';
import { Entity } from '../../types';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

interface RadarVisualizationProps {
  entities: Entity[];
}

export const RadarVisualization: React.FC<RadarVisualizationProps> = ({
  entities,
}) => {
  const radarRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (radarRef.current) {
      radarRef.current.rotation.z += 0.01;
    }
  });

  return (
    <group ref={radarRef}>
      <mesh>
        <cylinderGeometry args={[8, 8, 0.1, 32]} />
        <meshBasicMaterial color={0x1e3a8a} transparent opacity={0.3} />
      </mesh>
      {[1, 2, 3, 4].map(ring => (
        <mesh key={ring} position={[0, 0, 0.05]}>
          <ringGeometry args={[ring * 1.5, ring * 1.5 + 0.1, 32]} />
          <meshBasicMaterial color={0x3b82f6} transparent opacity={0.2} />
        </mesh>
      ))}
      {entities.map((entity, index) => {
        const angle = (index / entities.length) * Math.PI * 2;
        const distance = 2 + Math.random() * 4;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        return (
          <group key={entity.id} position={[x, y, 0.1]}>
            <mesh>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial
                color={entity.type === 'Threat' ? 0xff4444 : 0x3b82f6}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
