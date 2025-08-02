import React, { Suspense, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { NetworkScene } from './NetworkScene';
import { Entity, EntityPosition } from '../../../types/entity';
import {
  CANVAS_STYLE,
  CONTROLS_CONFIG,
  MOBILE_CONTROLS_CONFIG,
  MOBILE_NETWORK_CAMERA_CONFIG,
} from '../../../constants/visualization';
import { ControlPanel } from '../TimelineVisualization/ControlPanel';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useIsMobile } from '../../../hooks/useRealTimeData';

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
  const isMobile = useIsMobile();

  const controlsConfig = isMobile ? MOBILE_CONTROLS_CONFIG : CONTROLS_CONFIG;
  const cameraConfig = isMobile
    ? MOBILE_NETWORK_CAMERA_CONFIG
    : { position: [0, 0, 30] as [number, number, number], fov: 45 };

  const handleZoomIn = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(controlsConfig.zoomFactor);
      controlsRef.current.update();
    }
  }, [controlsConfig.zoomFactor]);

  const handleZoomOut = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(controlsConfig.zoomFactor);
      controlsRef.current.update();
    }
  }, [controlsConfig.zoomFactor]);

  const handleReset = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  return (
    <div className="w-full h-full relative">
      <Canvas camera={cameraConfig} style={CANVAS_STYLE}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <OrbitControls ref={controlsRef} {...controlsConfig} />
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
