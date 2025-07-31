'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Entity } from '../types';

interface DataFlowVisualizationProps {
  entities: Entity[];
  isConnected: boolean;
}

export const DataFlowVisualization: React.FC<DataFlowVisualizationProps> = ({
  isConnected,
}) => {
  const flowRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.Group>(null);

  useFrame(state => {
    if (flowRef.current) {
      flowRef.current.rotation.y += 0.002;
    }

    if (linesRef.current) {
      // Animate the flowing lines
      const time = state.clock.elapsedTime;
      linesRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Line) {
          child.position.z = (time * 0.5 + index * 0.1) % 10;
        }
      });
    }
  });

  return (
    <group ref={flowRef}>
      {/* Central hub */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={0x3b82f6} transparent opacity={0.6} />
      </mesh>

      {/* Flowing data lines */}
      <group ref={linesRef}>
        {Array.from({ length: 10 }, (_, i) => (
          <mesh
            key={i}
            position={[
              Math.sin(i * 0.5) * 3,
              Math.cos(i * 0.5) * 2,
              (i % 5) * 2,
            ]}
          >
            <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
            <meshBasicMaterial
              color={Math.random() > 0.7 ? 0xff4444 : 0x3b82f6}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* Connection status indicator */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color={isConnected ? 0x10b981 : 0xef4444} />
      </mesh>

      {/* Data packets */}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
          ]}
        >
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial
            color={Math.random() > 0.8 ? 0xff4444 : 0x3b82f6}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};
