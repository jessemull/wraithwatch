'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ThreatParticleSystemProps {
  threatLevel: number; // 0-1
  position: [number, number, number];
}

export const ThreatParticleSystem: React.FC<ThreatParticleSystemProps> = ({
  threatLevel,
  position,
}) => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = Math.floor(threatLevel * 100) + 20;

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = 1 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      pts.push(
        new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        )
      );
    }
    return pts;
  }, [particleCount]);

  useFrame(state => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.01;
      particlesRef.current.rotation.x += 0.005;
      const scale =
        1 + Math.sin(state.clock.elapsedTime * threatLevel * 2) * 0.2;
      particlesRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      <points ref={particlesRef}>
        <bufferGeometry
          attach="geometry"
          {...new THREE.BufferGeometry().setFromPoints(points)}
        />
        <pointsMaterial
          size={0.05}
          color={0xff4444}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
