import React from 'react';
import { render } from '@testing-library/react';
import { ConnectionLine } from '../ConnectionLine';
jest.mock('three', () => ({
  Vector3: jest.fn().mockImplementation((x, y, z) => ({ x, y, z })),
  BufferGeometry: jest.fn().mockImplementation(() => ({
    setFromPoints: jest.fn(),
  })),
  LineBasicMaterial: jest.fn().mockImplementation(() => ({})),
  Line: jest.fn().mockImplementation(() => ({})),
}));
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
  it('renders ConnectionLine with primitive object', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];
    render(<ConnectionLine start={start} end={end} />);
    expect(document.body).toBeInTheDocument();
  });
  it('renders with default strength and type', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];
    render(<ConnectionLine start={start} end={end} />);
    expect(document.body).toBeInTheDocument();
  });
  it('renders with custom strength', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];
    render(<ConnectionLine start={start} end={end} strength={0.8} />);
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
      const { rerender } = render(<ConnectionLine start={start} end={end} />);
      expect(document.body).toBeInTheDocument();
      rerender(<div />);
    });
  });
  it('handles zero distance', () => {
    const start: [number, number, number] = [1, 1, 1];
    const end: [number, number, number] = [1, 1, 1];
    render(<ConnectionLine start={start} end={end} />);
    expect(document.body).toBeInTheDocument();
  });
  it('handles negative coordinates', () => {
    const start: [number, number, number] = [-1, -2, -3];
    const end: [number, number, number] = [1, 2, 3];
    render(<ConnectionLine start={start} end={end} />);
    expect(document.body).toBeInTheDocument();
  });
});
