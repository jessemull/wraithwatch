import * as THREE from 'three';
import React, { useMemo } from 'react';
import { CONNECTION_LINE_CONFIG } from '../../../constants/visualization';

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  strength?: number;
  type?: 'location' | 'agent' | 'network' | 'type';
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  start,
  end,
  strength = CONNECTION_LINE_CONFIG.defaultStrength,
  type = CONNECTION_LINE_CONFIG.defaultType,
}) => {
  const connectionColor = useMemo(() => {
    return (
      CONNECTION_LINE_CONFIG.colors[type] || CONNECTION_LINE_CONFIG.colors.type
    );
  }, [type]);

  const opacity = useMemo(() => {
    return (
      CONNECTION_LINE_CONFIG.opacityRange.min +
      strength * CONNECTION_LINE_CONFIG.opacityRange.strengthMultiplier
    );
  }, [strength]);

  const lineObject = useMemo(() => {
    const points = [
      new THREE.Vector3(start[0], start[1], start[2]),
      new THREE.Vector3(end[0], end[1], end[2]),
    ];

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: connectionColor,
      transparent: true,
      opacity,
    });

    return new THREE.Line(lineGeometry, lineMaterial);
  }, [start, end, connectionColor, opacity]);

  return <primitive object={lineObject} />;
};
