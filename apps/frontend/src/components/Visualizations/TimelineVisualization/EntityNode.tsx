import React, { useMemo, useState, useEffect } from 'react';
import { Entity } from '../../../types/entity';
import { Text } from '@react-three/drei';
import {
  ENTITY_STYLES,
  DEFAULT_ENTITY_STYLE,
  TIMELINE_CONFIG,
} from '../../../constants/visualization';
import { EntityStyle } from '../../../types/visualization';
import { getEntityName } from '../../../util/entity';

interface EntityNodeProps {
  entity: Entity;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}

export const EntityNode: React.FC<EntityNodeProps> = ({
  entity,
  position,
  isSelected,
  onClick,
}) => {
  const style = useMemo((): EntityStyle => {
    const entityStyle =
      ENTITY_STYLES[entity.type as keyof typeof ENTITY_STYLES] ||
      DEFAULT_ENTITY_STYLE;
    const variant = isSelected ? entityStyle.selected : entityStyle.default;

    return {
      color: entityStyle.base.color,
      emissive: entityStyle.base.color,
      emissiveIntensity: variant.emissiveIntensity,
      size: variant.size,
      textColor: entityStyle.base.textColor,
      pulse: entityStyle.base.pulse,
    };
  }, [entity.type, isSelected]);

  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    if (!style.pulse) return;

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
  }, [style.pulse]);

  const pulseMesh = useMemo(() => {
    if (!style.pulse) return null;

    return (
      <mesh scale={[pulseScale, pulseScale, pulseScale]}>
        <sphereGeometry
          args={[style.size * TIMELINE_CONFIG.pulse.scaleMultiplier, 16, 16]}
        />
        <meshStandardMaterial
          color={style.color}
          transparent="true"
          opacity={TIMELINE_CONFIG.pulse.opacity}
          emissive={style.emissive}
          emissiveIntensity={TIMELINE_CONFIG.pulse.emissiveIntensity}
        />
      </mesh>
    );
  }, [style.pulse, style.size, style.color, style.emissive, pulseScale]);

  const textPosition = useMemo(
    () => [0, style.size + 0.6, 0] as [number, number, number],
    [style.size]
  );

  return (
    <group position={position}>
      <mesh
        onClick={onClick}
        scale={style.pulse ? [pulseScale, pulseScale, pulseScale] : [1, 1, 1]}
      >
        <sphereGeometry args={[style.size, 16, 16]} />
        <meshStandardMaterial
          color={style.color}
          emissive={style.emissive}
          emissiveIntensity={style.emissiveIntensity}
        />
      </mesh>
      {pulseMesh}
      <Text
        position={textPosition}
        fontSize={TIMELINE_CONFIG.text.fontSize}
        color={style.textColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={TIMELINE_CONFIG.text.outlineWidth}
        outlineColor={TIMELINE_CONFIG.text.outlineColor}
      >
        {getEntityName(entity.id)}
      </Text>
    </group>
  );
};
