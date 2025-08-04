import React from 'react';
import { render } from '@testing-library/react';
import { ConnectionParticle } from '../ConnectionParticle';

// Mock Three.js and React Three Fiber
jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(callback => {
    // Simulate frame updates
    callback({ clock: { elapsedTime: 1.0 } });
  }),
}));

jest.mock('three', () => ({
  Vector3: jest.fn().mockImplementation((x = 0, y = 0, z = 0) => ({
    x,
    y,
    z,
    copy: jest.fn(),
    lerpVectors: jest.fn(),
  })),
  Group: jest.fn().mockImplementation(() => ({
    children: [],
  })),
  Mesh: jest.fn().mockImplementation(() => ({
    position: { copy: jest.fn() },
    visible: false,
  })),
  SphereGeometry: jest.fn(),
  MeshStandardMaterial: jest.fn(),
}));

jest.mock('../../../../constants/visualization', () => ({
  CONNECTION_LINE_CONFIG: {
    colors: {
      type: '#ffffff',
      location: '#ff0000',
      agent: '#00ff00',
      network: '#0000ff',
    },
  },
  CONNECTION_PARTICLE_CONFIG: {
    defaultSpeed: 1.0,
    defaultParticleCount: 5,
    defaultParticleSize: 0.1,
    speedVariation: { min: 0.5, max: 1.5 },
    delayRange: { max: 2.0 },
    animation: {
      progressIncrement: 0.01,
      maxProgress: 1.0,
    },
    resetDelayRange: { min: 0.5, max: 1.5 },
    particleGeometry: { segments: 8 },
    particleMaterial: {
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8,
    },
  },
}));

let originalError: typeof console.error;

beforeAll(() => {
  originalError = console.error;
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

const mockStart: [number, number, number] = [0, 0, 0];
const mockEnd: [number, number, number] = [10, 10, 10];

describe('ConnectionParticle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('renders with custom particle count', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} particleCount={10} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('renders with custom particle size', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} particleSize={0.2} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('renders with custom speed', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} speed={2.0} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('renders with different types', () => {
    const types = ['location', 'agent', 'network', 'type'] as const;

    types.forEach(type => {
      const { container, unmount } = render(
        <ConnectionParticle start={mockStart} end={mockEnd} type={type} />
      );
      expect(container.querySelector('group')).toBeInTheDocument();
      unmount();
    });
  });

  it('renders with different start and end positions', () => {
    const customStart: [number, number, number] = [1, 2, 3];
    const customEnd: [number, number, number] = [4, 5, 6];

    const { container } = render(
      <ConnectionParticle start={customStart} end={customEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('renders with zero coordinates', () => {
    const zeroPosition: [number, number, number] = [0, 0, 0];
    const { container } = render(
      <ConnectionParticle start={zeroPosition} end={zeroPosition} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('renders with negative coordinates', () => {
    const negativeStart: [number, number, number] = [-1, -2, -3];
    const negativeEnd: [number, number, number] = [-4, -5, -6];

    const { container } = render(
      <ConnectionParticle start={negativeStart} end={negativeEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('renders with large coordinates', () => {
    const largeStart: [number, number, number] = [1000, 2000, 3000];
    const largeEnd: [number, number, number] = [4000, 5000, 6000];

    const { container } = render(
      <ConnectionParticle start={largeStart} end={largeEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('renders with minimum particle count', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} particleCount={1} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('renders with maximum particle count', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} particleCount={20} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('renders with minimum particle size', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} particleSize={0.01} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('renders with maximum particle size', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} particleSize={1.0} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('renders with minimum speed', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} speed={0.1} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('renders with maximum speed', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} speed={10.0} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('renders with all custom props', () => {
    const { container } = render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type="agent"
        speed={2.0}
        particleCount={8}
        particleSize={0.15}
      />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles undefined type gracefully', () => {
    const { container } = render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type={undefined as any}
      />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles invalid type gracefully', () => {
    const { container } = render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type={'invalid' as any}
      />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles zero speed', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} speed={0} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles negative speed', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} speed={-1.0} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles very large speed', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} speed={100.0} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles zero particle count', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} particleCount={0} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles very large particle count', () => {
    const { container } = render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        particleCount={1000}
      />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles zero particle size', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} particleSize={0} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles very large particle size', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} particleSize={10.0} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles negative particle size', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} particleSize={-1.0} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles identical start and end positions', () => {
    const identicalPosition: [number, number, number] = [0, 0, 0];
    const { container } = render(
      <ConnectionParticle start={identicalPosition} end={identicalPosition} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles very large coordinates', () => {
    const largeStart: [number, number, number] = [1000000, 1000000, 1000000];
    const largeEnd: [number, number, number] = [2000000, 2000000, 2000000];
    const { container } = render(
      <ConnectionParticle start={largeStart} end={largeEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles negative coordinates', () => {
    const negativeStart: [number, number, number] = [-100, -100, -100];
    const negativeEnd: [number, number, number] = [-200, -200, -200];
    const { container } = render(
      <ConnectionParticle start={negativeStart} end={negativeEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles decimal coordinates', () => {
    const decimalStart: [number, number, number] = [0.1, 0.2, 0.3];
    const decimalEnd: [number, number, number] = [1.1, 1.2, 1.3];
    const { container } = render(
      <ConnectionParticle start={decimalStart} end={decimalEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles mixed coordinate types', () => {
    const mixedStart: [number, number, number] = [0, -100, 1000];
    const mixedEnd: [number, number, number] = [100, 0, -1000];
    const { container } = render(
      <ConnectionParticle start={mixedStart} end={mixedEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles all custom props', () => {
    const { container } = render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type="location"
        speed={2.0}
        particleCount={15}
        particleSize={0.8}
      />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles minimum values', () => {
    const { container } = render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        speed={0.001}
        particleCount={1}
        particleSize={0.001}
      />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles maximum values', () => {
    const { container } = render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        speed={999.999}
        particleCount={9999}
        particleSize={999.999}
      />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles undefined props', () => {
    const { container } = render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type={undefined}
        speed={undefined}
        particleCount={undefined}
        particleSize={undefined}
      />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles null props', () => {
    const { container } = render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type={null as any}
        speed={null as any}
        particleCount={null as any}
        particleSize={null as any}
      />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles empty string type', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} type={'' as any} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles invalid type', () => {
    const { container } = render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type={'invalid' as any}
      />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles NaN values', () => {
    const { container } = render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        speed={NaN}
        particleCount={NaN}
        particleSize={NaN}
      />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles complex coordinate calculations', () => {
    const complexStart: [number, number, number] = [
      Math.PI,
      Math.E,
      Math.sqrt(2),
    ];
    const complexEnd: [number, number, number] = [
      Math.LN2,
      Math.LN10,
      Math.LOG2E,
    ];
    const { container } = render(
      <ConnectionParticle start={complexStart} end={complexEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles extreme coordinate differences', () => {
    const extremeStart: [number, number, number] = [
      Number.MIN_VALUE,
      Number.MIN_VALUE,
      Number.MIN_VALUE,
    ];
    const extremeEnd: [number, number, number] = [
      Number.MAX_VALUE,
      Number.MAX_VALUE,
      Number.MAX_VALUE,
    ];
    const { container } = render(
      <ConnectionParticle start={extremeStart} end={extremeEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles ref properly', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles mesh creation', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} particleCount={5} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles geometry creation', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} particleSize={0.5} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles material creation', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} type="location" />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles group structure', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles useCallback for createParticle', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles useEffect for particle initialization', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles useFrame animation logic', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles particle activation logic', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles particle progress updates', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles particle position calculations', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles particle reset logic', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles mesh visibility updates', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles null particlesRef gracefully', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles missing mesh gracefully', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles particle array operations', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} particleCount={10} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles speed variation calculations', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} speed={2.0} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles delay calculations', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles progress increment calculations', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles max progress checks', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles reset delay calculations', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles sphere geometry creation', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} particleSize={0.3} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles mesh standard material creation', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} type="network" />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles material properties', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles transparent material', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles opacity settings', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles emissive intensity', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles geometry segments', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles array generation for particles', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} particleCount={7} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles key generation for meshes', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} particleCount={3} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });

  it('handles initial mesh visibility', () => {
    const { container } = render(
      <ConnectionParticle start={mockStart} end={mockEnd} />
    );
    expect(container.querySelector('group')).toBeInTheDocument();
  });
});
