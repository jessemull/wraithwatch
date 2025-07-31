'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { DataFlow } from './DataFlow';
import { Entity } from '../../types';
import { GlobeVisualization } from './GlobeVisualization';
import { MatrixVisualization } from './MatrixVisualization';
import { NetworkVisualization } from './NetworkVisualization';
import { OrbitControls } from '@react-three/drei';
import { RadarVisualization } from './RadarVisualization';
import { useEffect, useState } from 'react';

interface VisualizationHubProps {
  entities: Entity[];
  isConnected: boolean;
}

type VisualizationType = 'network' | 'radar' | 'globe' | 'matrix' | 'dataflow';

// Main Scene Component...

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
        return <NetworkVisualization entities={entities} />;
      case 'radar':
        return <RadarVisualization entities={entities} />;
      case 'globe':
        return <GlobeVisualization entities={entities} />;
      case 'matrix':
        return <MatrixVisualization entities={entities} />;
      case 'dataflow':
        return <DataFlow entities={entities} isConnected={isConnected} />;
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

// Main Component...

export const VisualizationHub: React.FC<VisualizationHubProps> = ({
  entities,
  isConnected,
}) => {
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
      {!isConnected && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-xs">
          Disconnected
        </div>
      )}
      <div className="absolute bottom-4 left-4 bg-gray-800 text-white px-2 py-1 rounded text-xs">
        {entities.length} entities
      </div>
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
