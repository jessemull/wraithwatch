import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';

interface TimeScaleProps {
  position: [number, number, number];
}

export const TimeScale: React.FC<TimeScaleProps> = ({ position }) => {
  const timeScaleData = useMemo(() => {
    // Use current time as timeline bounds
    const now = new Date();
    const startTime = new Date(now.getTime() - (24 * 60 * 60 * 1000)); // 24 hours ago
    const endTime = now;
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

    return {
      startTime,
      endTime,
      duration,
      formattedStartTime: formatTime(startTime),
      formattedEndTime: formatTime(endTime),
      formattedDuration: formatDuration(duration),
    };
  }, []);

  if (!timeScaleData) return null;

  const { formattedStartTime, formattedEndTime, formattedDuration } =
    timeScaleData;

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
        {formattedEndTime}
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
        {formattedStartTime}
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
        {formattedDuration}
      </Text>
    </group>
  );
};
