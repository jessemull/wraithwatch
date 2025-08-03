import React from 'react';
import { render, screen } from '@testing-library/react';
import { Matrix3D } from '../Matrix3D';

// Mock Three.js components
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children, style }: any) => (
    <div data-testid="canvas" style={style}>
      {children}
    </div>
  ),
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: ({ ...props }: any) => (
    <div data-testid="orbit-controls" {...props} />
  ),
}));

// Mock the MatrixScene component
jest.mock('../MatrixScene', () => ({
  MatrixScene: ({ entities }: any) => (
    <div data-testid="matrix-scene">
      Matrix Scene ({entities.length} entities)
    </div>
  ),
}));

// Mock the ControlPanel component
jest.mock('../../TimelineVisualization/ControlPanel', () => ({
  ControlPanel: ({ onZoomIn, onZoomOut, onReset }: any) => (
    <div data-testid="control-panel">
      <button onClick={onZoomIn}>Zoom In</button>
      <button onClick={onZoomOut}>Zoom Out</button>
      <button onClick={onReset}>Reset</button>
    </div>
  ),
}));

// Mock the useIsMobile hook
jest.mock('../../../../hooks/useRealTimeData', () => ({
  useIsMobile: () => false,
}));

// Mock constants
jest.mock('../../../../constants/visualization', () => ({
  CANVAS_STYLE: { width: '100%', height: '100%' },
  MOBILE_CONTROLS_CONFIG: { zoomFactor: 1.5 },
  CONTROLS_CONFIG: { zoomFactor: 1.2 },
  MOBILE_MATRIX_CAMERA_CONFIG: { position: [0, 2, 10], fov: 60 },
}));

describe('Matrix3D', () => {
  const mockEntities = [
    {
      id: 'entity-1',
      name: 'Test Entity',
      type: 'Threat' as const,
      properties: {},
      lastSeen: '2023-01-01T12:00:00Z',
      changesToday: 5,
    },
  ];

  const mockPositions = [
    {
      entity_id: 'entity-1',
      matrix_position: { x: 0, y: 2, z: 0 },
    },
  ];

  it('renders Matrix3D component with canvas and controls', () => {
    render(
      <Matrix3D
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );

    expect(screen.getByTestId('canvas')).toBeInTheDocument();
    expect(screen.getByTestId('orbit-controls')).toBeInTheDocument();
    expect(screen.getByTestId('matrix-scene')).toBeInTheDocument();
    expect(screen.getByTestId('control-panel')).toBeInTheDocument();
  });

  it('renders with correct number of entities', () => {
    render(
      <Matrix3D
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );

    expect(screen.getByText('Matrix Scene (1 entities)')).toBeInTheDocument();
  });

  it('renders control panel with zoom and reset buttons', () => {
    render(
      <Matrix3D
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );

    expect(screen.getByText('Zoom In')).toBeInTheDocument();
    expect(screen.getByText('Zoom Out')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('renders with empty entities array', () => {
    render(
      <Matrix3D
        entities={[]}
        positions={[]}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );

    expect(screen.getByText('Matrix Scene (0 entities)')).toBeInTheDocument();
  });
});
