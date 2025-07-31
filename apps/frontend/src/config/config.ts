export const config = {
  app: {
    description: 'Adaptive, Intelligent Cyber Defense',
    name: 'Wraithwatch',
    tagline: 'Real-Time Entity Monitoring Dashboard',
  },
  features: {
    enableAnimations: true,
    enableBackdropBlur: true,
  },
  websocket: {
    url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001',
  },
} as const;
