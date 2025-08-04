import React, { useRef, useMemo } from 'react';
import { DataParticleProps } from '../../../types/visualization';
import { DATA_PARTICLE_CONFIG } from '../../../constants/visualization';

export const DataParticle: React.FC<DataParticleProps> = ({
  position,
  type = 'ambient',
}) => {
  const timeRef = useRef(Date.now() * 0.001);

  const particleStyle = useMemo(
    () =>
      type === 'threat'
        ? DATA_PARTICLE_CONFIG.styles.threat
        : DATA_PARTICLE_CONFIG.styles.ambient,
    [type]
  );

  const animationValues = useMemo(() => {
    const time = timeRef.current;
    const pulse =
      Math.sin(time * DATA_PARTICLE_CONFIG.animation.speed) * 0.5 + 0.5;

    return {
      size:
        particleStyle.size *
        (1 +
          pulse *
            (DATA_PARTICLE_CONFIG.animation.sizeMultiplier.max -
              DATA_PARTICLE_CONFIG.animation.sizeMultiplier.min)),
      opacity:
        DATA_PARTICLE_CONFIG.animation.opacityRange.min +
        pulse *
          (DATA_PARTICLE_CONFIG.animation.opacityRange.max -
            DATA_PARTICLE_CONFIG.animation.opacityRange.min),
      emissiveIntensity:
        DATA_PARTICLE_CONFIG.animation.emissiveRange.min +
        pulse *
          (DATA_PARTICLE_CONFIG.animation.emissiveRange.max -
            DATA_PARTICLE_CONFIG.animation.emissiveRange.min),
    };
  }, [particleStyle.size]);

  return (
    <mesh position={position}>
      <sphereGeometry
        args={[
          animationValues.size,
          DATA_PARTICLE_CONFIG.geometry.segments,
          DATA_PARTICLE_CONFIG.geometry.segments,
        ]}
      />
      <meshStandardMaterial
        color={particleStyle.color}
        emissive={particleStyle.color}
        emissiveIntensity={animationValues.emissiveIntensity}
        transparent={true}
        opacity={animationValues.opacity}
      />
    </mesh>
  );
};
