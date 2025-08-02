import React, { Suspense, useRef, useCallback } from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  CAMERA_CONFIG,
  LIGHTING_CONFIG,
  CONTROLS_CONFIG,
  CANVAS_STYLE,
} from '../../../constants/visualization';
import { Canvas } from '@react-three/fiber';
import { ControlPanel } from './ControlPanel';
import { Entity } from '../../../types/entity';
import { OrbitControls } from '@react-three/drei';
import { TimelineScene } from './TimelineScene';

interface TimelineVisualizationProps {
  entities: Entity[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

export const TimelineVisualization: React.FC<TimelineVisualizationProps> = ({
  entities,
  selectedEntity,
  onEntitySelect,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Optimized control handlers with useCallback...

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
      <Canvas camera={CAMERA_CONFIG} style={CANVAS_STYLE}>
        <Suspense fallback={null}>
          <ambientLight intensity={LIGHTING_CONFIG.ambient.intensity} />
          {LIGHTING_CONFIG.pointLights.map((light, index) => (
            <pointLight
              key={index}
              position={light.position}
              intensity={light.intensity}
            />
          ))}
          <OrbitControls ref={controlsRef} {...CONTROLS_CONFIG} />
          <TimelineScene
            entities={entities}
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
