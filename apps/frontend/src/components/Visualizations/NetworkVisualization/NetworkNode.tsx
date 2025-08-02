import React, { useMemo, useState, useEffect } from 'react';
import { Text } from '@react-three/drei';
import { Entity } from '../../../types/entity';
import { NETWORK_NODE_CONFIG } from '../../../constants/visualization';

interface NetworkNodeProps {
  entity: Entity;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}

export const NetworkNode: React.FC<NetworkNodeProps> = ({
  entity,
  position,
  isSelected,
  onClick,
}) => {
  const nodeStyle = useMemo(() => {
    const size = isSelected
      ? NETWORK_NODE_CONFIG.nodeSizes.selected
      : NETWORK_NODE_CONFIG.nodeSizes.default;
    const intensity = isSelected
      ? NETWORK_NODE_CONFIG.intensities.selected
      : NETWORK_NODE_CONFIG.intensities.default;
    const color =
      NETWORK_NODE_CONFIG.entityColors[
        entity.type as keyof typeof NETWORK_NODE_CONFIG.entityColors
      ] || NETWORK_NODE_CONFIG.entityColors.Threat;
    return {
      color,
      size,
      emissiveIntensity: intensity,
    };
  }, [entity.type, isSelected]);

  const isThreat = entity.type === 'Threat';
  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    if (!isThreat) return;

    let animationId: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const pulseSpeed = 0.003; // Speed of the pulse
      const pulseRange = 0.3; // Range of the pulse (0.7 to 1.3)

      const scale = 1 + pulseRange * Math.sin(elapsed * pulseSpeed);
      setPulseScale(scale);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isThreat]);

  const threatHalo = useMemo(() => {
    if (!isThreat) return null;

    return (
      <>
        <mesh scale={[pulseScale, pulseScale, pulseScale]}>
          <sphereGeometry
            args={[
              nodeStyle.size + NETWORK_NODE_CONFIG.threatHaloOffset,
              NETWORK_NODE_CONFIG.sphereSegments,
              NETWORK_NODE_CONFIG.sphereSegments,
            ]}
          />
          <meshStandardMaterial
            color={NETWORK_NODE_CONFIG.entityColors.Threat}
            transparent
            opacity={0.3}
            emissive={NETWORK_NODE_CONFIG.entityColors.Threat}
            emissiveIntensity={0.2}
          />
        </mesh>
        <mesh scale={[pulseScale * 0.8, pulseScale * 0.8, pulseScale * 0.8]}>
          <sphereGeometry
            args={[
              nodeStyle.size + NETWORK_NODE_CONFIG.threatHighlightOffset,
              NETWORK_NODE_CONFIG.sphereSegments,
              NETWORK_NODE_CONFIG.sphereSegments,
            ]}
          />
          <meshStandardMaterial
            color={NETWORK_NODE_CONFIG.entityColors.Threat}
            transparent
            opacity={0.2}
            emissive={NETWORK_NODE_CONFIG.entityColors.Threat}
            emissiveIntensity={0.1}
          />
        </mesh>
      </>
    );
  }, [isThreat, nodeStyle.size, pulseScale]);

  return (
    <group position={position}>
      {threatHalo}
      <mesh
        onClick={onClick}
        scale={isThreat ? [pulseScale, pulseScale, pulseScale] : [1, 1, 1]}
      >
        <sphereGeometry
          args={[
            nodeStyle.size,
            NETWORK_NODE_CONFIG.sphereSegments,
            NETWORK_NODE_CONFIG.sphereSegments,
          ]}
        />
        <meshStandardMaterial
          color={nodeStyle.color}
          emissive={nodeStyle.color}
          emissiveIntensity={nodeStyle.emissiveIntensity}
          metalness={0.4}
          roughness={0.1}
        />
      </mesh>
      <Text
        position={[0, nodeStyle.size + NETWORK_NODE_CONFIG.labelOffset, 0]}
        fontSize={NETWORK_NODE_CONFIG.labelFontSize}
        color="#ffffff"
        anchorX="center"
        anchorY="bottom"
        maxWidth={NETWORK_NODE_CONFIG.labelMaxWidth}
        textAlign="center"
        outlineWidth={NETWORK_NODE_CONFIG.labelOutlineWidth}
        outlineColor="#000000"
      >
        {entity.name}
      </Text>
    </group>
  );
};
