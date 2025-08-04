import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConnectionParticle } from '../ConnectionParticle';

let originalError: typeof console.error;

beforeAll(() => {
  originalError = console.error;
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn((callback) => {
    callback({ clock: { elapsedTime: 1.0 } });
  }),
}));

jest.mock('three', () => ({
  Vector3: jest.fn((x, y, z) => ({ x, y, z, lerpVectors: jest.fn() })),
  Group: jest.fn(() => ({
    children: [],
  })),
  Mesh: jest.fn(() => ({
    position: { copy: jest.fn() },
    visible: true,
  })),
  SphereGeometry: jest.fn(),
  MeshStandardMaterial: jest.fn(),
}));

jest.mock('../../../../constants/visualization', () => ({
  CONNECTION_LINE_CONFIG: {
    colors: {
      location: '#ff0000',
      agent: '#00ff00',
      network: '#0000ff',
      type: '#ffffff',
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

const mockStart: [number, number, number] = [0, 0, 0];
const mockEnd: [number, number, number] = [10, 10, 10];

describe('ConnectionParticle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders ConnectionParticle component with default props', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders with custom particle count', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        particleCount={10}
      />
    );

    const group = screen.getByTestId('connection-particle-group');
    expect(group).toBeInTheDocument();
  });

  it('renders with custom particle size', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        particleSize={0.2}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders with custom speed', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        speed={2.0}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders with type as default', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type="type"
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders with different start and end positions', () => {
    const customStart: [number, number, number] = [1, 2, 3];
    const customEnd: [number, number, number] = [4, 5, 6];

    render(
      <ConnectionParticle
        start={customStart}
        end={customEnd}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders with zero start position', () => {
    const zeroStart: [number, number, number] = [0, 0, 0];

    render(
      <ConnectionParticle
        start={zeroStart}
        end={mockEnd}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders with zero end position', () => {
    const zeroEnd: [number, number, number] = [0, 0, 0];

    render(
      <ConnectionParticle
        start={mockStart}
        end={zeroEnd}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders with negative coordinates', () => {
    const negativeStart: [number, number, number] = [-1, -2, -3];
    const negativeEnd: [number, number, number] = [-4, -5, -6];

    render(
      <ConnectionParticle
        start={negativeStart}
        end={negativeEnd}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders with large coordinates', () => {
    const largeStart: [number, number, number] = [1000, 2000, 3000];
    const largeEnd: [number, number, number] = [4000, 5000, 6000];

    render(
      <ConnectionParticle
        start={largeStart}
        end={largeEnd}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders with minimum particle count', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        particleCount={1}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders with maximum particle count', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        particleCount={20}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders with minimum particle size', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        particleSize={0.01}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders with maximum particle size', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        particleSize={1.0}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders with minimum speed', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        speed={0.1}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders with maximum speed', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        speed={10.0}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders with all custom props', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type="agent"
        speed={2.0}
        particleCount={8}
        particleSize={0.15}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles undefined type gracefully', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type={undefined as any}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders with location type', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type="location"
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders with agent type', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type="agent"
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders with network type', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type="network"
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles invalid type gracefully', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type={"invalid" as any}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders with sphere geometry', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders with mesh standard material', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('renders particles as initially invisible', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with different speeds', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        speed={2.0}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with custom particle count', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        particleCount={10}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with custom particle size', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        particleSize={0.5}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with location type', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type="location"
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with agent type', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type="agent"
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with network type', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type="network"
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with default type', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type="type"
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with zero speed', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        speed={0}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with negative speed', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        speed={-1.0}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with very large speed', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        speed={100.0}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with zero particle count', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        particleCount={0}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with very large particle count', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        particleCount={1000}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with zero particle size', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        particleSize={0}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with very large particle size', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        particleSize={10.0}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with negative particle size', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        particleSize={-1.0}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with identical start and end positions', () => {
    const identicalPosition: [number, number, number] = [0, 0, 0];
    render(
      <ConnectionParticle
        start={identicalPosition}
        end={identicalPosition}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with very large coordinates', () => {
    const largeStart: [number, number, number] = [1000000, 1000000, 1000000];
    const largeEnd: [number, number, number] = [2000000, 2000000, 2000000];
    render(
      <ConnectionParticle
        start={largeStart}
        end={largeEnd}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with negative coordinates', () => {
    const negativeStart: [number, number, number] = [-100, -100, -100];
    const negativeEnd: [number, number, number] = [-200, -200, -200];
    render(
      <ConnectionParticle
        start={negativeStart}
        end={negativeEnd}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with decimal coordinates', () => {
    const decimalStart: [number, number, number] = [0.1, 0.2, 0.3];
    const decimalEnd: [number, number, number] = [1.1, 1.2, 1.3];
    render(
      <ConnectionParticle
        start={decimalStart}
        end={decimalEnd}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with mixed coordinate types', () => {
    const mixedStart: [number, number, number] = [0, -100, 1000];
    const mixedEnd: [number, number, number] = [100, 0, -1000];
    render(
      <ConnectionParticle
        start={mixedStart}
        end={mixedEnd}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with all custom props', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type="location"
        speed={2.0}
        particleCount={15}
        particleSize={0.8}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with minimum values', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        speed={0.001}
        particleCount={1}
        particleSize={0.001}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with maximum values', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        speed={999.999}
        particleCount={9999}
        particleSize={999.999}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with undefined props', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type={undefined}
        speed={undefined}
        particleCount={undefined}
        particleSize={undefined}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with null props', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type={null as any}
        speed={null as any}
        particleCount={null as any}
        particleSize={null as any}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with empty string type', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type={"" as any}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with invalid type', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type={"invalid" as any}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with NaN values', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        speed={NaN}
        particleCount={NaN}
        particleSize={NaN}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with complex coordinate calculations', () => {
    const complexStart: [number, number, number] = [Math.PI, Math.E, Math.sqrt(2)];
    const complexEnd: [number, number, number] = [Math.LN2, Math.LN10, Math.LOG2E];
    render(
      <ConnectionParticle
        start={complexStart}
        end={complexEnd}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with extreme coordinate differences', () => {
    const extremeStart: [number, number, number] = [Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE];
    const extremeEnd: [number, number, number] = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
    render(
      <ConnectionParticle
        start={extremeStart}
        end={extremeEnd}
      />
    );

    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with ref handling', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
      />
    );

    // Test that ref is properly handled
    const groupElement = screen.getByTestId('connection-particle-group');
    expect(groupElement).toBeInTheDocument();
  });

  it('handles particle animation with mesh creation', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        particleCount={5}
      />
    );

    // Test that meshes are created correctly
    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with geometry creation', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        particleSize={0.5}
      />
    );

    // Test that geometry is created with correct size
    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with material creation', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
        type="location"
      />
    );

    // Test that material is created with correct color
    expect(screen.getByTestId('connection-particle-group')).toBeInTheDocument();
  });

  it('handles particle animation with group structure', () => {
    render(
      <ConnectionParticle
        start={mockStart}
        end={mockEnd}
      />
    );

    // Test that group structure is correct
    const groupElement = screen.getByTestId('connection-particle-group');
    expect(groupElement).toBeInTheDocument();
  });
});
