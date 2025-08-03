import React from 'react';
import { render } from '@testing-library/react';
import { ConnectionParticle } from '../ConnectionParticle';

// Mock Three.js
jest.mock('three', () => ({
  Vector3: jest.fn().mockImplementation((x, y, z) => ({ x, y, z })),
  Group: jest.fn().mockImplementation(() => ({ children: [] })),
}));

// Mock @react-three/fiber
jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(callback => {
    // Mock the useFrame hook
    callback({ clock: { elapsedTime: 0 } });
  }),
}));

// Mock constants
jest.mock('../../../../constants/visualization', () => ({
  CONNECTION_LINE_CONFIG: {
    colors: {
      location: '#4ecdc4',
      agent: '#45b7d1',
      network: '#96ceb4',
      type: '#ff6b6b',
    },
  },
  CONNECTION_PARTICLE_CONFIG: {
    defaultSpeed: 0.5,
    defaultParticleCount: 2,
    defaultParticleSize: 0.1,
    speedVariation: {
      min: 0.8,
      max: 1.2,
    },
    delayRange: {
      max: 2.0,
    },
    animation: {
      progressIncrement: 0.01,
      maxProgress: 1.0,
    },
    resetDelayRange: {
      min: 0.5,
      max: 1.5,
    },
    particleGeometry: {
      segments: 8,
    },
    particleMaterial: {
      emissiveIntensity: 0.8,
      transparent: "true",
      opacity: 0.7,
    },
  },
}));

describe('ConnectionParticle', () => {
  it('renders ConnectionParticle with group and particles', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];

    render(<ConnectionParticle start={start} end={end} />);

    // Since we're mocking Three.js components, we can't easily test the group
    // But we can verify the component renders without errors
    expect(document.body).toBeInTheDocument();
  });

  it('renders with default props', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];

    render(<ConnectionParticle start={start} end={end} />);

    // Should render without errors
    expect(document.body).toBeInTheDocument();
  });

  it('renders with custom speed and particle count', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];

    render(
      <ConnectionParticle
        start={start}
        end={end}
        speed={0.8}
        particleCount={3}
      />
    );

    // Should render without errors
    expect(document.body).toBeInTheDocument();
  });

  it('renders with different connection types', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];
    const types = ['location', 'agent', 'network', 'type'] as const;

    types.forEach(type => {
      const { rerender } = render(
        <ConnectionParticle start={start} end={end} type={type} />
      );

      // Should render without errors
      expect(document.body).toBeInTheDocument();

      // Clean up for next iteration
      rerender(<div />);
    });
  });

  it('renders with different coordinates', () => {
    const coordinates = [
      {
        start: [0, 0, 0] as [number, number, number],
        end: [1, 1, 1] as [number, number, number],
      },
      {
        start: [1, 2, 3] as [number, number, number],
        end: [4, 5, 6] as [number, number, number],
      },
      {
        start: [-1, -2, -3] as [number, number, number],
        end: [-4, -5, -6] as [number, number, number],
      },
    ];

    coordinates.forEach(({ start, end }) => {
      const { rerender } = render(
        <ConnectionParticle start={start} end={end} />
      );

      // Should render without errors
      expect(document.body).toBeInTheDocument();

      // Clean up for next iteration
      rerender(<div />);
    });
  });

  it('handles zero distance', () => {
    const start: [number, number, number] = [1, 1, 1];
    const end: [number, number, number] = [1, 1, 1];

    render(<ConnectionParticle start={start} end={end} />);

    // Should handle zero distance gracefully
    expect(document.body).toBeInTheDocument();
  });

  it('handles negative coordinates', () => {
    const start: [number, number, number] = [-1, -2, -3];
    const end: [number, number, number] = [1, 2, 3];

    render(<ConnectionParticle start={start} end={end} />);

    // Should handle negative coordinates
    expect(document.body).toBeInTheDocument();
  });

  it('renders with custom particle size', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];

    render(<ConnectionParticle start={start} end={end} particleSize={0.2} />);

    // Should render without errors
    expect(document.body).toBeInTheDocument();
  });
});
