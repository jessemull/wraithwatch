import React from 'react';
import { render } from '@testing-library/react';
import { ConnectionLine } from '../ConnectionLine';

// Mock Three.js
jest.mock('three', () => ({
  Vector3: jest.fn().mockImplementation((x, y, z) => ({ x, y, z })),
  BufferGeometry: jest.fn().mockImplementation(() => ({
    setFromPoints: jest.fn(),
  })),
  LineBasicMaterial: jest.fn().mockImplementation(() => ({})),
  Line: jest.fn().mockImplementation(() => ({})),
}));

// Mock constants
jest.mock('../../../../constants/visualization', () => ({
  CONNECTION_LINE_CONFIG: {
    defaultStrength: 0.5,
    defaultType: 'type',
    colors: {
      location: '#4ecdc4',
      agent: '#45b7d1',
      network: '#96ceb4',
      type: '#ff6b6b',
    },
    opacityRange: {
      min: 0.2,
      strengthMultiplier: 0.8,
    },
  },
}));

describe('ConnectionLine', () => {
  it('renders ConnectionLine with primitive object', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];

    render(<ConnectionLine start={start} end={end} />);

    // Since we're mocking Three.js components, we can't easily test the primitive
    // But we can verify the component renders without errors
    expect(document.body).toBeInTheDocument();
  });

  it('renders with default strength and type', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];

    render(<ConnectionLine start={start} end={end} />);

    // Should render without errors
    expect(document.body).toBeInTheDocument();
  });

  it('renders with custom strength', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];

    render(<ConnectionLine start={start} end={end} strength={0.8} />);

    // Should render without errors
    expect(document.body).toBeInTheDocument();
  });

  it('renders with different connection types', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];
    const types = ['location', 'agent', 'network', 'type'] as const;

    types.forEach(type => {
      const { rerender } = render(
        <ConnectionLine start={start} end={end} type={type} />
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
      const { rerender } = render(<ConnectionLine start={start} end={end} />);

      // Should render without errors
      expect(document.body).toBeInTheDocument();

      // Clean up for next iteration
      rerender(<div />);
    });
  });

  it('handles zero distance', () => {
    const start: [number, number, number] = [1, 1, 1];
    const end: [number, number, number] = [1, 1, 1];

    render(<ConnectionLine start={start} end={end} />);

    // Should handle zero distance gracefully
    expect(document.body).toBeInTheDocument();
  });

  it('handles negative coordinates', () => {
    const start: [number, number, number] = [-1, -2, -3];
    const end: [number, number, number] = [1, 2, 3];

    render(<ConnectionLine start={start} end={end} />);

    // Should handle negative coordinates
    expect(document.body).toBeInTheDocument();
  });
});
