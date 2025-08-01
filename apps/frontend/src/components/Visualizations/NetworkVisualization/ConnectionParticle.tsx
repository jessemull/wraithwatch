import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  CONNECTION_LINE_CONFIG,
  CONNECTION_PARTICLE_CONFIG,
} from '../../../constants/visualization';
import { Particle } from '../../../types/visualization';

interface ConnectionParticleProps {
  start: [number, number, number];
  end: [number, number, number];
  type?: 'location' | 'agent' | 'network' | 'type';
  speed?: number;
  particleCount?: number;
  particleSize?: number;
}

export const ConnectionParticle: React.FC<ConnectionParticleProps> = ({
  start,
  end,
  type = 'type',
  speed = CONNECTION_PARTICLE_CONFIG.defaultSpeed,
  particleCount = CONNECTION_PARTICLE_CONFIG.defaultParticleCount,
  particleSize = CONNECTION_PARTICLE_CONFIG.defaultParticleSize,
}) => {
  const particlesRef = useRef<THREE.Group>(null);
  const particles = useRef<Particle[]>([]);

  const connectionColor = useMemo(() => {
    return (
      CONNECTION_LINE_CONFIG.colors[type] || CONNECTION_LINE_CONFIG.colors.type
    );
  }, [type]);

  const startVector = useMemo(
    () => new THREE.Vector3(start[0], start[1], start[2]),
    [start]
  );
  const endVector = useMemo(
    () => new THREE.Vector3(end[0], end[1], end[2]),
    [end]
  );

  const createParticle = useCallback(
    (speed: number): Particle => ({
      position: new THREE.Vector3(),
      progress: 0,
      speed:
        speed *
        (CONNECTION_PARTICLE_CONFIG.speedVariation.min +
          Math.random() *
            (CONNECTION_PARTICLE_CONFIG.speedVariation.max -
              CONNECTION_PARTICLE_CONFIG.speedVariation.min)),
      delay: Math.random() * CONNECTION_PARTICLE_CONFIG.delayRange.max,
      active: false,
    }),
    []
  );

  useEffect(() => {
    // Initialize particles with random delays and speeds...
    
    particles.current = Array.from({ length: particleCount }, () =>
      createParticle(speed)
    );
  }, [particleCount, speed, createParticle]);

  useFrame(state => {
    if (!particlesRef.current) return;

    const time = state.clock.elapsedTime;
    const progressIncrement =
      CONNECTION_PARTICLE_CONFIG.animation.progressIncrement;
    const maxProgress = CONNECTION_PARTICLE_CONFIG.animation.maxProgress;

    particles.current.forEach((particle, index) => {
      const mesh = particlesRef.current?.children[index] as THREE.Mesh;
      if (!mesh) return;

      // Activate particle after delay...

      if (time > particle.delay && !particle.active) {
        particle.active = true;
        particle.progress = 0;
      }

      if (particle.active) {
        // Update progress...

        particle.progress += particle.speed * progressIncrement;

        // Calculate position along the line...

        particle.position.lerpVectors(
          startVector,
          endVector,
          particle.progress
        );

        // Update the mesh position...

        mesh.position.copy(particle.position);
        mesh.visible = true;

        // Reset particle when it reaches the end...

        if (particle.progress >= maxProgress) {
          particle.active = false;
          particle.delay =
            time +
            CONNECTION_PARTICLE_CONFIG.resetDelayRange.min +
            Math.random() *
              (CONNECTION_PARTICLE_CONFIG.resetDelayRange.max -
                CONNECTION_PARTICLE_CONFIG.resetDelayRange.min);
          mesh.visible = false;
        }
      } else {
        // Hide particle when inactive...

        mesh.visible = false;
      }
    });
  });

  return (
    <group ref={particlesRef}>
      {Array.from({ length: particleCount }, (_, index) => (
        <mesh key={index} visible={false}>
          <sphereGeometry
            args={[
              particleSize,
              CONNECTION_PARTICLE_CONFIG.particleGeometry.segments,
              CONNECTION_PARTICLE_CONFIG.particleGeometry.segments,
            ]}
          />
          <meshStandardMaterial
            color={connectionColor}
            emissive={connectionColor}
            emissiveIntensity={
              CONNECTION_PARTICLE_CONFIG.particleMaterial.emissiveIntensity
            }
            transparent={
              CONNECTION_PARTICLE_CONFIG.particleMaterial.transparent
            }
            opacity={CONNECTION_PARTICLE_CONFIG.particleMaterial.opacity}
          />
        </mesh>
      ))}
    </group>
  );
};
