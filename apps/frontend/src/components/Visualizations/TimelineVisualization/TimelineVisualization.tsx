import React, { Suspense, useRef, useCallback } from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  CAMERA_CONFIG,
  MOBILE_CAMERA_CONFIG,
  LIGHTING_CONFIG,
  CONTROLS_CONFIG,
  MOBILE_CONTROLS_CONFIG,
  CANVAS_STYLE,
} from '../../../constants/visualization';
import { Canvas } from '@react-three/fiber';
import { ControlPanel } from './ControlPanel';
import { Entity, EntityPosition } from '../../../types/entity';
import { OrbitControls } from '@react-three/drei';
import { TimelineScene } from './TimelineScene';
import { useIsMobile } from '../../../hooks/useRealTimeData';

interface TimelineVisualizationProps {
  entities: Entity[];
  positions: EntityPosition[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

export const TimelineVisualization: React.FC<TimelineVisualizationProps> = ({
  entities,
  positions,
  selectedEntity,
  onEntitySelect,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const isMobile = useIsMobile();

  const cameraConfig = isMobile ? MOBILE_CAMERA_CONFIG : CAMERA_CONFIG;
  const controlsConfig = isMobile ? MOBILE_CONTROLS_CONFIG : CONTROLS_CONFIG;

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
          <ambientLight intensity={LIGHTING_CONFIG.ambient.intensity} />
          {LIGHTING_CONFIG.pointLights.map((light, index) => (
            <pointLight
              key={index}
              position={light.position}
              intensity={light.intensity}
            />
          ))}
          <OrbitControls ref={controlsRef} {...controlsConfig} />
          <TimelineScene
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
