import '@testing-library/jest-dom';
import React from 'react';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock Three.js for 3D components
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => React.createElement('div', { 'data-testid': 'canvas' }, children),
  useFrame: jest.fn(),
  useThree: jest.fn(() => ({
    camera: {},
    gl: {},
    scene: {},
  })),
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: ({ children }: { children: React.ReactNode }) => React.createElement('div', { 'data-testid': 'orbit-controls' }, children),
  Text: ({ children }: { children: React.ReactNode }) => React.createElement('div', { 'data-testid': 'text' }, children),
}));

// Mock Chart.js
jest.mock('react-chartjs-2', () => ({
  Line: () => React.createElement('canvas', { 'data-testid': 'line-chart' }),
  Bar: () => React.createElement('canvas', { 'data-testid': 'bar-chart' }),
  Doughnut: () => React.createElement('canvas', { 'data-testid': 'doughnut-chart' }),
  Pie: () => React.createElement('canvas', { 'data-testid': 'pie-chart' }),
}));

// Mock WebSocket
global.WebSocket = class MockWebSocket {
  readyState = 1;
  send = jest.fn();
  close = jest.fn();
  addEventListener = jest.fn();
  removeEventListener = jest.fn();
  constructor() {}
};

// Mock ResizeObserver
global.ResizeObserver = class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  constructor() {}
};

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ 
      entities: [
        {
          id: 'test-entity-1',
          name: 'Test Entity 1',
          type: 'server',
          status: 'active',
          properties: { ip: '192.168.1.1' }
        }
      ], 
      positions: [
        {
          entity_id: 'test-entity-1',
          x: 0,
          y: 0,
          z: 0
        }
      ] 
    }),
  })
) as jest.Mock; 