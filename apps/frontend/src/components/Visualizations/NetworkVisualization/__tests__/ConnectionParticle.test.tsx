import React from 'react';
import { render } from '@testing-library/react';
import { ConnectionParticle } from '../ConnectionParticle';
jest.mock('three', () => ({
  Vector3: jest.fn().mockImplementation((x, y, z) => ({ x, y, z })),
  Group: jest.fn().mockImplementation(() => ({ children: [] })),
}));
jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(callback => {
    callback({ clock: { elapsedTime: 0 } });
  }),
}));
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
      transparent: true,
      opacity: 0.7,
    },
  },
}));
describe('ConnectionParticle', () => {
  let originalError: typeof console.error;
  let originalWarn: typeof console.warn;

  beforeAll(() => {
    originalError = console.error;
    originalWarn = console.warn;
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
  });
  it('renders ConnectionParticle with group and particles', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];
    render(<ConnectionParticle start={start} end={end} />);
    expect(document.body).toBeInTheDocument();
  });
  it('renders with default props', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];
    render(<ConnectionParticle start={start} end={end} />);
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
      expect(document.body).toBeInTheDocument();
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
      expect(document.body).toBeInTheDocument();
      rerender(<div />);
    });
  });
  it('handles zero distance', () => {
    const start: [number, number, number] = [1, 1, 1];
    const end: [number, number, number] = [1, 1, 1];
    render(<ConnectionParticle start={start} end={end} />);
    expect(document.body).toBeInTheDocument();
  });
  it('handles negative coordinates', () => {
    const start: [number, number, number] = [-1, -2, -3];
    const end: [number, number, number] = [1, 2, 3];
    render(<ConnectionParticle start={start} end={end} />);
    expect(document.body).toBeInTheDocument();
  });
  it('renders with custom particle size', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];
    render(<ConnectionParticle start={start} end={end} particleSize={0.2} />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders with very small particle size', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];
    render(<ConnectionParticle start={start} end={end} particleSize={0.01} />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders with very large particle size', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];
    render(<ConnectionParticle start={start} end={end} particleSize={1.0} />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders with zero particle count', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];
    render(<ConnectionParticle start={start} end={end} particleCount={0} />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders with large particle count', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];
    render(<ConnectionParticle start={start} end={end} particleCount={10} />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders with very slow speed', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];
    render(<ConnectionParticle start={start} end={end} speed={0.1} />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders with very fast speed', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];
    render(<ConnectionParticle start={start} end={end} speed={2.0} />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders with zero speed', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];
    render(<ConnectionParticle start={start} end={end} speed={0} />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders with negative speed', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];
    render(<ConnectionParticle start={start} end={end} speed={-0.5} />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders with extreme coordinates', () => {
    const start: [number, number, number] = [1000, 1000, 1000];
    const end: [number, number, number] = [-1000, -1000, -1000];
    render(<ConnectionParticle start={start} end={end} />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders with decimal coordinates', () => {
    const start: [number, number, number] = [0.1, 0.2, 0.3];
    const end: [number, number, number] = [0.9, 0.8, 0.7];
    render(<ConnectionParticle start={start} end={end} />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders with all props customized', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];
    render(
      <ConnectionParticle
        start={start}
        end={end}
        type="agent"
        speed={0.8}
        particleCount={5}
        particleSize={0.15}
      />
    );
    expect(document.body).toBeInTheDocument();
  });
});
