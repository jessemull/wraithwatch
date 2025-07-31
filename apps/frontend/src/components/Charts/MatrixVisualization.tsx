'use client';

import * as THREE from 'three';
import { Entity } from '../../types';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

interface MatrixVisualizationProps {
  entities: Entity[];
}

export const MatrixVisualization: React.FC<MatrixVisualizationProps> = ({
  entities,
}) => {
  const matrixRef = useRef<THREE.Group>(null);

  useFrame(state => {
    if (matrixRef.current) {
      matrixRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          child.position.y += Math.sin(state.clock.elapsedTime + index) * 0.01;
        }
      });
    }
  });

  return (
    <group ref={matrixRef}>
      {Array.from({ length: 20 }, (_, x) =>
        Array.from({ length: 20 }, (_, z) => (
          <mesh key={`${x}-${z}`} position={[x - 10, 0, z - 10]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color={0x10b981} transparent opacity={0.3} />
          </mesh>
        ))
      )}
      {entities.map((entity, index) => {
        const x = (index % 5) * 2 - 4;
        const z = Math.floor(index / 5) * 2 - 4;
        const height = 2 + Math.random() * 3;

        return (
          <group key={entity.id} position={[x, height / 2, z]}>
            <mesh>
              <cylinderGeometry args={[0.2, 0.2, height, 8]} />
              <meshBasicMaterial
                color={entity.type === 'Threat' ? 0xff4444 : 0x3b82f6}
                transparent
                opacity={0.8}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
