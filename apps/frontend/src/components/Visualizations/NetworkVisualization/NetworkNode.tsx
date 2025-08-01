import React, { useMemo } from 'react';
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

  const threatHalo = useMemo(() => {
    if (!isThreat) return null;

    return (
      <>
        <mesh>
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
        <mesh>
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
  }, [isThreat, nodeStyle.size]);

  return (
    <group position={position}>
      {threatHalo}
      <mesh onClick={onClick}>
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
        color="white"
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
