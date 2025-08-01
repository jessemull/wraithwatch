import React from 'react';
import { EntityChange } from '../../../types/api';
import { Text } from '@react-three/drei';

interface TimeScaleProps {
  changes: EntityChange[];
  position: [number, number, number];
}

export const TimeScale: React.FC<TimeScaleProps> = ({ changes, position }) => {
  if (changes.length === 0) return null;

  const sortedChanges = [...changes].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const startTime = new Date(sortedChanges[0].timestamp);
  const endTime = new Date(sortedChanges[sortedChanges.length - 1].timestamp);
  const duration = endTime.getTime() - startTime.getTime();

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <group position={position}>
      <Text
        position={[0, 8, 0]}
        fontSize={0.8}
        color="#ffff00"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="black"
      >
        {formatTime(endTime)}
      </Text>
      <Text
        position={[0, -8, 0]}
        fontSize={0.8}
        color="#ffff00"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="black"
      >
        {formatTime(startTime)}
      </Text>
      <Text
        position={[0, 0, 0]}
        fontSize={0.6}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="black"
      >
        {formatDuration(duration)}
      </Text>
    </group>
  );
};
