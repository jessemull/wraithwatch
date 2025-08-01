import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ControlPanel } from './ControlPanel';
import { Entity } from '../../../types/entity';
import { EntityChange } from '../../../types/api';
import { OrbitControls, Stats } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { TimelineScene } from './TimelineScene';

interface TimelineVisualizationProps {
  entities: Entity[];
  changes: EntityChange[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

export const TimelineVisualization: React.FC<TimelineVisualizationProps> = ({
  entities,
  changes,
  selectedEntity,
  onEntitySelect,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const selectedEntityChanges = selectedEntity
    ? changes.filter(change => change.entity_id === selectedEntity.id)
    : [];

  const allChanges = changes;

  const handleZoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(1.2);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(1.2);
      controlsRef.current.update();
    }
  };

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="w-full h-full bg-black relative">
      <Canvas
        camera={{ position: [0, 0, 35], fov: 35 }}
        style={{ background: 'linear-gradient(to bottom, #0f0f23, #1a1a2e)' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={60}
            minDistance={15}
          />
          <TimelineScene
            entities={entities}
            changes={selectedEntityChanges}
            allChanges={allChanges}
            selectedEntity={selectedEntity}
            onEntitySelect={onEntitySelect}
          />
          <Stats />
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
