export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
  app: {
    description:
      'Wraithwatch - Advanced AI-powered cyber defense command center for real-time entity monitoring, threat detection, and intelligent security analytics. Monitor your digital infrastructure with cutting-edge visualization and predictive insights.',
    name: 'Wraithwatch',
    tagline: 'Real-Time Entity Monitoring Dashboard',
  },
  features: {
    enableAnimations: true,
    enableBackdropBlur: true,
  },
  websocket: {
    url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001/ws',
  },
} as const;
