import { EntityChange } from './api';
import { Entity } from './entity';
import * as THREE from 'three';

export interface EntityStyle {
  color: string;
  emissive: string;
  emissiveIntensity: number;
  size: number;
  textColor: string;
  pulse: boolean;
}

export interface EntityStyleVariant {
  emissiveIntensity: number;
  size: number;
  color?: string;
}

export interface EntityStyleBase {
  color: string;
  textColor: string;
  pulse: boolean;
}

export interface EntityStyleConfig {
  base: EntityStyleBase;
  selected: EntityStyleVariant;
  default: EntityStyleVariant;
}

export interface ParticleStyle {
  color: string;
  emissive: string;
  emissiveIntensity: number;
  size: number;
}

export interface TimelineBounds {
  startTime: number;
  endTime: number;
}

export interface ChangeParticleData {
  change: EntityChange;
  position: [number, number, number];
  key: string;
}

export interface TimelineData {
  timelineBounds: TimelineBounds;
  entityPositions: [number, number, number][];
  selectedEntityIndex: number;
  changeParticles: ChangeParticleData[];
}

export interface TimeScaleData {
  startTime: Date;
  endTime: Date;
  duration: number;
  formattedStartTime: string;
  formattedEndTime: string;
  formattedDuration: string;
}

export interface ControlButton {
  label: string;
  onClick: () => void;
  className: string;
  icon?: string;
}

export interface CameraConfig {
  position: [number, number, number];
  fov: number;
}

export interface LightingConfig {
  ambient: { intensity: number };
  pointLights: Array<{
    position: [number, number, number];
    intensity: number;
  }>;
}

export interface ControlsConfig {
  enablePan: boolean;
  enableZoom: boolean;
  enableRotate: boolean;
  maxDistance: number;
  minDistance: number;
  zoomFactor: number;
}

export interface EntityDistributionConfig {
  heightSpread: number;
  baseRadius: number;
  radiusIncrement: number;
  maxRadiusMultiplier: number;
}

export interface ParticleDistributionConfig {
  baseRadius: number;
  radiusIncrement: number;
  maxRadiusMultiplier: number;
  verticalSpread: number;
}

export interface TimelineMarkersConfig {
  count: number;
  spacing: number;
  offset: number;
  geometry: { radius: number; segments: number };
  material: { color: string; emissive: string; emissiveIntensity: number };
}

export interface TimelineAxisConfig {
  geometry: { radius: number; height: number; segments: number };
  material: { color: string; emissive: string; emissiveIntensity: number };
}

export interface TextConfig {
  fontSize: number;
  outlineWidth: number;
  outlineColor: string;
  infoText: {
    fontSize: number;
    color: string;
    outlineWidth: number;
  };
}

export interface PulseConfig {
  scaleMultiplier: number;
  opacity: number;
  emissiveIntensity: number;
}

export interface TimelineConfig {
  entityDistribution: EntityDistributionConfig;
  particleDistribution: ParticleDistributionConfig;
  markers: TimelineMarkersConfig;
  axis: TimelineAxisConfig;
  text: TextConfig;
  pulse: PulseConfig;
}

export interface ControlPanelConfig {
  position: string;
  styling: string;
  buttonClasses: {
    zoom: string;
    reset: string;
    rotate: string;
  };
  helpText: string[];
}

export interface NetworkConnection {
  from: Entity;
  to: Entity;
  strength: number;
  type: 'location' | 'agent' | 'network' | 'type';
}

export interface NetworkLayout {
  entityPositions: Map<string, [number, number, number]>;
  connections: NetworkConnection[];
}

export interface Particle {
  position: THREE.Vector3;
  progress: number;
  speed: number;
  delay: number;
  active: boolean;
}
