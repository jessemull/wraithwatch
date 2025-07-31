'use client';

import * as THREE from 'three';
import { Entity } from '../../types';
import { Html } from '@react-three/drei';
import { ThreatParticles } from './ThreatParticles';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';

interface NetworkVisualizationProps {
  entities: Entity[];
}

const NetworkNode: React.FC<{
  entity: Entity;
  index: number;
  total: number;
}> = ({ entity, index, total }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Position in a circle...

  const angle = (index / total) * Math.PI * 2;
  const radius = 5;
  const position = [
    Math.cos(angle) * radius,
    Math.sin(angle) * radius * 0.5,
    0,
  ];

  useFrame(state => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y +=
        Math.sin(state.clock.elapsedTime + index) * 0.001;

      // Pulse animation for threats...

      if (
        entity.type === 'Threat' &&
        entity.threatScore &&
        entity.threatScore > 0.5
      ) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        meshRef.current.scale.setScalar(scale);
      }
    }

    if (glowRef.current && entity.type === 'AI_Agent') {
      glowRef.current.rotation.y += 0.02;
    }
  });

  const getEntityColor = (entity: Entity): number => {
    switch (entity.type) {
      case 'AI_Agent':
        return 0x3b82f6;
      case 'Network_Node':
        return 0x10b981;
      case 'Threat':
        return 0xef4444;
      case 'System':
        return 0xf59e0b;
      case 'User':
        return 0x8b5cf6;
      case 'Sensor':
        return 0x06b6d4;
      default:
        return 0x6b7280;
    }
  };

  return (
    <group position={position as [number, number, number]}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshPhongMaterial
          color={getEntityColor(entity)}
          transparent
          opacity={0.8}
        />
      </mesh>
      {entity.type === 'AI_Agent' && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial color={0x3b82f6} transparent opacity={0.3} />
        </mesh>
      )}
      {entity.threatScore && entity.threatScore > 0.5 && (
        <mesh position={[0.4, 0.4, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color={0xff4444} transparent opacity={0.8} />
        </mesh>
      )}
      {entity.threatScore && entity.threatScore > 0.7 && (
        <ThreatParticles
          threatLevel={entity.threatScore}
          position={[0, 0, 0]}
        />
      )}
      {hovered && (
        <Html position={[0, 0.5, 0]} center>
          <div className="bg-gray-900 text-white p-2 rounded text-xs whitespace-nowrap">
            <div className="font-bold">{entity.name}</div>
            <div>{entity.type}</div>
            {entity.threatScore && (
              <div>Threat: {(entity.threatScore * 100).toFixed(0)}%</div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

export const NetworkVisualization: React.FC<NetworkVisualizationProps> = ({
  entities,
}) => {
  return (
    <>
      {entities.map((entity, index) => (
        <NetworkNode
          key={entity.id}
          entity={entity}
          index={index}
          total={entities.length}
        />
      ))}
    </>
  );
};
