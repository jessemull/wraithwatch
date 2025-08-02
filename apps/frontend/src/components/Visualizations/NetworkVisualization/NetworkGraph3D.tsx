import React, { Suspense, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Entity } from '../../../types/entity';
import { NetworkScene } from './NetworkScene';
import { OrbitControls } from '@react-three/drei';
import {
  CANVAS_STYLE,
  CONTROLS_CONFIG,
} from '../../../constants/visualization';
import { ControlPanel } from '../TimelineVisualization/ControlPanel';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface EntityPosition {
  entity_id: string;
  entity_type: string;
  name: string;
  timeline_position: {
    x: number;
    y: number;
    z: number;
  };
  network_position: {
    x: number;
    y: number;
    z: number;
  };
  change_particles: Array<{
    x: number;
    y: number;
    z: number;
  }>;
}

interface NetworkGraph3DProps {
  entities: Entity[];
  positions: EntityPosition[];
  onEntitySelect?: (entity: Entity) => void;
  selectedEntity?: Entity;
}

export const NetworkGraph3D: React.FC<NetworkGraph3DProps> = ({
  entities,
  positions,
  selectedEntity,
  onEntitySelect,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const handleZoomIn = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(CONTROLS_CONFIG.zoomFactor);
      controlsRef.current.update();
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(CONTROLS_CONFIG.zoomFactor);
      controlsRef.current.update();
    }
  }, []);

  const handleReset = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }} style={CANVAS_STYLE}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={50}
            minDistance={5}
          />
          <NetworkScene
            entities={entities}
            positions={positions}
            selectedEntity={selectedEntity}
            onEntitySelect={onEntitySelect}
          />
        </Suspense>
      </Canvas>
      <ControlPanel
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
      />
    </div>
  );
};
