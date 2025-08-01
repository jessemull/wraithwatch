import React from 'react';
import * as THREE from 'three';

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  strength?: number;
  type?: 'location' | 'agent' | 'network' | 'type';
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  start,
  end,
  strength = 0.5,
  type = 'type',
}) => {
  // Color based on connection type
  const getConnectionColor = () => {
    switch (type) {
      case 'agent':
        return '#4ecdc4'; // AI agent connections
      case 'location':
        return '#6c5ce7'; // Location-based connections
      case 'network':
        return '#00b894'; // Network connections
      case 'type':
      default:
        return '#ff7675'; // Type-based connections
    }
  };

  // Create a line geometry that properly connects the two points
  const points = [
    new THREE.Vector3(start[0], start[1], start[2]),
    new THREE.Vector3(end[0], end[1], end[2])
  ];

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: getConnectionColor(),
    transparent: true,
    opacity: 0.6 + (strength * 0.4),
    linewidth: 2 + (strength * 3), // Note: linewidth doesn't work in WebGL, but we'll use it for reference
  });

  return (
    <line geometry={lineGeometry} material={lineMaterial} />
  );
};
