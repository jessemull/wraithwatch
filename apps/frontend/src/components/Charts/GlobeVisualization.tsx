'use client';

import * as THREE from 'three';
import { Entity } from '../../types';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

interface GlobeVisualizationProps {
  entities: Entity[];
}

export const GlobeVisualization: React.FC<GlobeVisualizationProps> = ({
  entities,
}) => {
  const globeRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={globeRef}>
      <mesh>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color={0x1e40af} transparent opacity={0.3} />
      </mesh>
      {Array.from({ length: 18 }, (_, i) => (
        <mesh key={`lat-${i}`} rotation={[0, 0, (i * Math.PI) / 18]}>
          <ringGeometry args={[4, 4.1, 32]} />
          <meshBasicMaterial color={0x3b82f6} transparent opacity={0.1} />
        </mesh>
      ))}
      {entities.map(entity => {
        const lat = (Math.random() - 0.5) * Math.PI;
        const lon = (Math.random() - 0.5) * Math.PI * 2;
        const x = Math.cos(lat) * Math.cos(lon) * 4.2;
        const y = Math.sin(lat) * 4.2;
        const z = Math.cos(lat) * Math.sin(lon) * 4.2;
        return (
          <group key={entity.id} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial
                color={entity.type === 'Threat' ? 0xff4444 : 0x10b981}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
