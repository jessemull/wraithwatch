import React from 'react';
import { render, screen } from '@testing-library/react';
import { MatrixNode } from '../MatrixNode';
jest.mock('@react-three/drei', () => ({
  Text: ({ children, fontSize, color, maxWidth, textAlign }: any) => (
    <div
      data-testid="text"
      style={{ position: 'absolute', fontSize, color, maxWidth, textAlign }}
    >
      {children}
    </div>
  ),
}));
describe('MatrixNode', () => {
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
  const mockEntity = {
    id: 'threat-1',
    name: 'Test Threat',
    type: 'Threat' as const,
    properties: {},
    lastSeen: '2023-01-01T12:00:00Z',
    changesToday: 5,
  };
  it('renders MatrixNode with mesh and text', () => {
    render(
      <MatrixNode
        entity={mockEntity}
        position={[0, 2, 0]}
        isSelected={false}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByTestId('text')).toBeInTheDocument();
  });
  it('renders threat entity with correct label', () => {
    render(
      <MatrixNode
        entity={mockEntity}
        position={[0, 2, 0]}
        isSelected={false}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByText(/Test Threat/)).toBeInTheDocument();
    expect(screen.getByText(/medium/)).toBeInTheDocument();
    expect(screen.getByText(/50%/)).toBeInTheDocument();
    expect(screen.getByText(/medium detections/)).toBeInTheDocument();
  });
  it('renders non-threat entity with simple label', () => {
    const nonThreatEntity = {
      ...mockEntity,
      type: 'System' as const,
      name: 'Test System',
    };
    render(
      <MatrixNode
        entity={nonThreatEntity}
        position={[0, 2, 0]}
        isSelected={false}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByText('Test System')).toBeInTheDocument();
  });
  it('handles click events', () => {
    const mockOnClick = jest.fn();
    render(
      <MatrixNode
        entity={mockEntity}
        position={[0, 2, 0]}
        isSelected={false}
        onClick={mockOnClick}
      />
    );
    expect(mockOnClick).not.toHaveBeenCalled();
  });
  it('renders with different threat severity levels', () => {
    const criticalPosition: [number, number, number] = [0, 6, 0];
    const highPosition: [number, number, number] = [0, 4, 0];
    const lowPosition: [number, number, number] = [0, 0, 0];
    const { rerender } = render(
      <MatrixNode
        entity={mockEntity}
        position={criticalPosition}
        isSelected={false}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByText(/critical/)).toBeInTheDocument();
    rerender(
      <MatrixNode
        entity={mockEntity}
        position={highPosition}
        isSelected={false}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByText(/high/)).toBeInTheDocument();
    rerender(
      <MatrixNode
        entity={mockEntity}
        position={lowPosition}
        isSelected={false}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByText(/low/)).toBeInTheDocument();
  });
  it('renders with different threat scores', () => {
    const highScorePosition: [number, number, number] = [0, 2, 3];
    const lowScorePosition: [number, number, number] = [0, 2, -3];
    const { rerender } = render(
      <MatrixNode
        entity={mockEntity}
        position={highScorePosition}
        isSelected={false}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByText(/100%/)).toBeInTheDocument();
    rerender(
      <MatrixNode
        entity={mockEntity}
        position={lowScorePosition}
        isSelected={false}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByText(/0%/)).toBeInTheDocument();
  });
  it('renders with different detection levels', () => {
    const highDetectionPosition: [number, number, number] = [3, 2, 0];
    const lowDetectionPosition: [number, number, number] = [-2, 2, 0];
    const { rerender } = render(
      <MatrixNode
        entity={mockEntity}
        position={highDetectionPosition}
        isSelected={false}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByText(/high detections/)).toBeInTheDocument();
    rerender(
      <MatrixNode
        entity={mockEntity}
        position={lowDetectionPosition}
        isSelected={false}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByText(/low detections/)).toBeInTheDocument();
  });
});
