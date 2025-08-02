import { VisualizationType } from '../types/visualization';

export const visualizationTypes: { type: VisualizationType; label: string }[] =
  [
    { type: 'timeline', label: 'Timeline' },
    { type: 'network', label: 'Network' },
    { type: 'globe', label: 'Globe' },
    { type: 'matrix', label: 'Matrix' },
  ];

export const ENTITY_STYLES = {
  Threat: {
    base: { color: '#ff6b6b', textColor: '#ffffff', pulse: true },
    selected: { color: '#ff4444', emissiveIntensity: 1.0, size: 0.5 },
    default: { emissiveIntensity: 0.8, size: 0.4 },
  },
  AI_Agent: {
    base: { color: '#4ecdc4', textColor: '#ffffff', pulse: false },
    selected: { emissiveIntensity: 0.8, size: 0.4 },
    default: { emissiveIntensity: 0.4, size: 0.3 },
  },
  System: {
    base: { color: '#45b7d1', textColor: '#ffffff', pulse: false },
    selected: { emissiveIntensity: 0.8, size: 0.4 },
    default: { emissiveIntensity: 0.4, size: 0.3 },
  },
  Network_Node: {
    base: { color: '#96ceb4', textColor: '#ffffff', pulse: false },
    selected: { emissiveIntensity: 0.8, size: 0.4 },
    default: { emissiveIntensity: 0.4, size: 0.3 },
  },
  User: {
    base: { color: '#feca57', textColor: '#ffffff', pulse: false },
    selected: { emissiveIntensity: 0.8, size: 0.4 },
    default: { emissiveIntensity: 0.4, size: 0.3 },
  },
} as const;

export const DEFAULT_ENTITY_STYLE = {
  base: { color: '#4ecdc4', textColor: '#ffffff', pulse: false },
  selected: { emissiveIntensity: 0.8, size: 0.4 },
  default: { emissiveIntensity: 0.4, size: 0.3 },
} as const;

export const PARTICLE_STYLES = {
  increase: {
    color: '#4ecdc4',
    emissive: '#4ecdc4',
    emissiveIntensity: 0.8,
    size: 0.1,
  },
  decrease: {
    color: '#ff6b6b',
    emissive: '#ff6b6b',
    emissiveIntensity: 0.8,
    size: 0.1,
  },
  change: {
    color: '#ffd93d',
    emissive: '#ffd93d',
    emissiveIntensity: 0.6,
    size: 0.08,
  },
} as const;

export const TIMELINE_CONFIG = {
  entityDistribution: {
    heightSpread: 16,
    baseRadius: 2,
    radiusIncrement: 1.5,
    maxRadiusMultiplier: 3,
  },
  particleDistribution: {
    baseRadius: 1,
    radiusIncrement: 0.8,
    maxRadiusMultiplier: 4,
    verticalSpread: 8,
  },
  markers: {
    count: 20,
    spacing: 1,
    offset: 10,
    geometry: { radius: 0.1, segments: 8 },
    material: { color: '#ffd93d', emissive: '#ffd93d', emissiveIntensity: 0.5 },
  },
  axis: {
    geometry: { radius: 0.05, height: 20, segments: 8 },
    material: { color: '#4a90e2', emissive: '#4a90e2', emissiveIntensity: 0.3 },
  },
  text: {
    fontSize: 0.4,
    outlineWidth: 0.03,
    outlineColor: 'black',
    infoText: {
      fontSize: 1.0,
      color: '#00ff00',
      outlineWidth: 0.1,
    },
  },
  pulse: {
    scaleMultiplier: 1.5,
    opacity: 0.3,
    emissiveIntensity: 0.2,
  },
} as const;

export const CAMERA_CONFIG = {
  position: [0, 0, 35] as [number, number, number],
  fov: 35,
} as const;

export const LIGHTING_CONFIG = {
  ambient: { intensity: 0.6 },
  pointLights: [
    { position: [10, 10, 10] as [number, number, number], intensity: 1 },
    { position: [-10, -10, -10] as [number, number, number], intensity: 0.5 },
  ],
} as const;

export const CONTROLS_CONFIG = {
  enablePan: true,
  enableZoom: true,
  enableRotate: true,
  maxDistance: 60,
  minDistance: 15,
  zoomFactor: 1.2,
} as const;

export const CANVAS_STYLE = {
  background: 'transparent',
} as const;

export const CONTROL_PANEL_CONFIG = {
  position: 'absolute top-4 right-4',
  styling: 'text-white',
  buttonClasses: {
    zoom: 'bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors',
    reset: 'bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors',
    rotate: 'bg-green-600 hover:bg-green-700 rounded-lg transition-colors',
  },
} as const;

export const NETWORK_NODE_CONFIG = {
  entityColors: {
    System: '#45b7d1',
    User: '#feca57',
    AI_Agent: '#4ecdc4',
    Threat: '#ff6b6b',
    Network_Node: '#96ceb4',
  } as const,
  nodeSizes: {
    selected: 0.4,
    default: 0.3,
  } as const,
  intensities: {
    selected: 0.8,
    default: 0.4,
  } as const,
  sphereSegments: 32,
  threatHaloOffset: 0.1,
  threatHighlightOffset: 0.05,
  labelOffset: 0.3,
  labelFontSize: 0.3,
  labelMaxWidth: 2,
  labelOutlineWidth: 0.02,
} as const;

export const CONNECTION_LINE_CONFIG = {
  colors: {
    agent: '#4ecdc4',
    location: '#6c5ce7',
    network: '#00b894',
    type: '#ff7675',
  } as const,
  defaultStrength: 0.5,
  defaultType: 'type' as const,
  opacityRange: {
    min: 0.6,
    strengthMultiplier: 0.4,
  } as const,
} as const;

export const NETWORK_SCENE_CONFIG = {
  entityLevels: {
    threats: { y: 3, radius: 6 },
    aiAgents: { y: 1.5, radius: 8 },
    systems: { y: 0, radius: 5 },
    networkNodes: { y: -1.5, radius: 7 },
    users: { y: -3, radius: 10 },
    default: { y: 0.5, radius: 4 },
  } as const,
  connectionRules: {
    aiAgentToSystem: { strength: 0.8, type: 'agent' as const },
    userToSystem: { strength: 0.6, type: 'network' as const },
    threatToSystem: { strength: 0.9, type: 'type' as const },
    networkNodeToSystem: { strength: 0.5, type: 'network' as const },
    userToNetworkNode: { strength: 0.4, type: 'network' as const },
  } as const,
  fallbackConnections: [
    { strength: 1.0, type: 'type' as const },
    { strength: 0.8, type: 'network' as const },
    { strength: 0.6, type: 'agent' as const },
    { strength: 0.7, type: 'network' as const },
  ] as const,
} as const;

export const CONNECTION_PARTICLE_CONFIG = {
  defaultSpeed: 0.5,
  defaultParticleCount: 3,
  defaultParticleSize: 0.05,
  speedVariation: { min: 0.8, max: 1.2 },
  delayRange: { min: 0, max: 2 },
  resetDelayRange: { min: 1, max: 4 },
  particleGeometry: { radius: 0.05, segments: 8 },
  particleMaterial: {
    emissiveIntensity: 0.8,
    opacity: 0.7,
    transparent: true,
  },
  animation: {
    progressIncrement: 0.01,
    maxProgress: 1.0,
  },
} as const;
