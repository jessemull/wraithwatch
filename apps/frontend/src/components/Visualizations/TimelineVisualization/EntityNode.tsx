import React, { useMemo } from 'react';
import { Entity } from '../../../types/entity';
import { Text } from '@react-three/drei';
import {
  ENTITY_STYLES,
  DEFAULT_ENTITY_STYLE,
  TIMELINE_CONFIG,
} from '../../../constants/visualization';
import { EntityStyle } from '../../../types/visualization';

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

  const pulseMesh = useMemo(() => {
    if (!style.pulse) return null;

    return (
      <mesh>
        <sphereGeometry
          args={[style.size * TIMELINE_CONFIG.pulse.scaleMultiplier, 16, 16]}
        />
        <meshStandardMaterial
          color={style.color}
          transparent
          opacity={TIMELINE_CONFIG.pulse.opacity}
          emissive={style.emissive}
          emissiveIntensity={TIMELINE_CONFIG.pulse.emissiveIntensity}
        />
      </mesh>
    );
  }, [style.pulse, style.size, style.color, style.emissive]);

  const textPosition = useMemo(
    () => [0, style.size + 0.2, 0] as [number, number, number],
    [style.size]
  );

  return (
    <group position={position}>
      <mesh onClick={onClick}>
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
        {entity.name}
      </Text>
    </group>
  );
};
