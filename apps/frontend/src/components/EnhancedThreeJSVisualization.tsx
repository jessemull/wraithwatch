'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Entity } from '../types';
import { ThreatParticleSystem } from './ThreatParticleSystem';
import { DataFlowVisualization } from './DataFlowVisualization';

interface EnhancedThreeJSVisualizationProps {
  entities: Entity[];
  isConnected: boolean;
}

type VisualizationType = 'network' | 'radar' | 'globe' | 'matrix' | 'dataflow';

// Network Node Component
const NetworkNode: React.FC<{
  entity: Entity;
  index: number;
  total: number;
}> = ({ entity, index, total }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Position in a circle
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

      // Pulse animation for threats
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
      {/* Main node */}
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

      {/* Glow effect for AI agents */}
      {entity.type === 'AI_Agent' && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial color={0x3b82f6} transparent opacity={0.3} />
        </mesh>
      )}

      {/* Threat indicator */}
      {entity.threatScore && entity.threatScore > 0.5 && (
        <mesh position={[0.4, 0.4, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color={0xff4444} transparent opacity={0.8} />
        </mesh>
      )}

      {/* Threat particle system for high-threat entities */}
      {entity.threatScore && entity.threatScore > 0.7 && (
        <ThreatParticleSystem
          threatLevel={entity.threatScore}
          position={[0, 0, 0]}
        />
      )}

      {/* Hover tooltip */}
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

// Radar Visualization Component
const RadarVisualization: React.FC<{ entities: Entity[] }> = ({ entities }) => {
  const radarRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (radarRef.current) {
      radarRef.current.rotation.z += 0.01;
    }
  });

  return (
    <group ref={radarRef}>
      {/* Radar base */}
      <mesh>
        <cylinderGeometry args={[8, 8, 0.1, 32]} />
        <meshBasicMaterial color={0x1e3a8a} transparent opacity={0.3} />
      </mesh>

      {/* Radar rings */}
      {[1, 2, 3, 4].map(ring => (
        <mesh key={ring} position={[0, 0, 0.05]}>
          <ringGeometry args={[ring * 1.5, ring * 1.5 + 0.1, 32]} />
          <meshBasicMaterial color={0x3b82f6} transparent opacity={0.2} />
        </mesh>
      ))}

      {/* Entity blips */}
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

// Globe Visualization Component
const GlobeVisualization: React.FC<{ entities: Entity[] }> = ({ entities }) => {
  const globeRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Earth sphere */}
      <mesh>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color={0x1e40af} transparent opacity={0.3} />
      </mesh>

      {/* Grid lines */}
      {Array.from({ length: 18 }, (_, i) => (
        <mesh key={`lat-${i}`} rotation={[0, 0, (i * Math.PI) / 18]}>
          <ringGeometry args={[4, 4.1, 32]} />
          <meshBasicMaterial color={0x3b82f6} transparent opacity={0.1} />
        </mesh>
      ))}

      {/* Entity points on globe */}
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

// Matrix Visualization Component
const MatrixVisualization: React.FC<{ entities: Entity[] }> = ({
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
      {/* Matrix grid */}
      {Array.from({ length: 20 }, (_, x) =>
        Array.from({ length: 20 }, (_, z) => (
          <mesh key={`${x}-${z}`} position={[x - 10, 0, z - 10]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color={0x10b981} transparent opacity={0.3} />
          </mesh>
        ))
      )}

      {/* Entity columns */}
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

// Main Scene Component
const Scene: React.FC<{
  entities: Entity[];
  visualizationType: VisualizationType;
  isConnected: boolean;
}> = ({ entities, visualizationType, isConnected }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 10);
  }, [camera]);

  const renderVisualization = () => {
    switch (visualizationType) {
      case 'network':
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
      case 'radar':
        return <RadarVisualization entities={entities} />;
      case 'globe':
        return <GlobeVisualization entities={entities} />;
      case 'matrix':
        return <MatrixVisualization entities={entities} />;
      case 'dataflow':
        return (
          <DataFlowVisualization
            entities={entities}
            isConnected={isConnected}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      {renderVisualization()}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  );
};

// Main Component
export const EnhancedThreeJSVisualization: React.FC<
  EnhancedThreeJSVisualizationProps
> = ({ entities, isConnected }) => {
  const [visualizationType, setVisualizationType] =
    useState<VisualizationType>('network');

  const visualizationTypes = [
    { key: 'network', label: 'Network Graph', icon: '🌐' },
    { key: 'radar', label: 'Radar Scan', icon: '📡' },
    { key: 'globe', label: 'Global View', icon: '🌍' },
    { key: 'matrix', label: 'Matrix Grid', icon: '🔲' },
    { key: 'dataflow', label: 'Data Flow', icon: '📊' },
  ] as const;

  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden relative">
      {/* Visualization Type Selector */}
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        {visualizationTypes.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setVisualizationType(key)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              visualizationType === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span className="mr-1">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-xs">
          Disconnected
        </div>
      )}

      {/* Entity Count */}
      <div className="absolute bottom-4 left-4 bg-gray-800 text-white px-2 py-1 rounded text-xs">
        {entities.length} entities
      </div>

      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{
          background:
            'linear-gradient(135deg, #0a0a0a 0%, #1e1e2e 50%, #0f172a 100%)',
        }}
      >
        <Scene
          entities={entities}
          visualizationType={visualizationType}
          isConnected={isConnected}
        />
      </Canvas>
    </div>
  );
};
