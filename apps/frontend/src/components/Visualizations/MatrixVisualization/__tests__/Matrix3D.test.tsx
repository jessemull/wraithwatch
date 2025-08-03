import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Matrix3D } from '../Matrix3D';

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children, style }: any) => (
    <div data-testid="canvas" style={style}>
      {children}
    </div>
  ),
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: ({ ...props }: any) => {
    // Remove function props that React doesn't allow on div elements
    const { dollyOut, dollyIn, reset, update, ...restProps } = props;
    return (
      <div data-testid="orbit-controls" {...restProps} />
    );
  },
}));

jest.mock('../MatrixScene', () => ({
  MatrixScene: ({ entities }: any) => (
    <div data-testid="matrix-scene">
      Matrix Scene ({entities.length} entities)
    </div>
  ),
}));

jest.mock('../../TimelineVisualization/ControlPanel', () => ({
  ControlPanel: ({ onZoomIn, onZoomOut, onReset }: any) => (
    <div data-testid="control-panel">
      <button onClick={onZoomIn}>Zoom In</button>
      <button onClick={onZoomOut}>Zoom Out</button>
      <button onClick={onReset}>Reset</button>
    </div>
  ),
}));

const mockUseIsMobile = jest.fn();
jest.mock('../../../../hooks/useRealTimeData', () => ({
  useIsMobile: () => mockUseIsMobile(),
}));

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
      entity_type: 'Threat',
      name: 'Test Entity',
      timeline_position: { x: 0, y: 0, z: 0 },
      network_position: { x: 0, y: 0, z: 0 },
      change_particles: [],
    },
  ];

  beforeEach(() => {
    mockUseIsMobile.mockReturnValue(false);
  });

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
    expect(screen.getByText('Matrix Scene (1 entities)')).toBeInTheDocument();
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

  it('renders with mobile configuration when useIsMobile returns true', () => {
    mockUseIsMobile.mockReturnValue(true);
    
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
  });

  it('renders with desktop configuration when useIsMobile returns false', () => {
    mockUseIsMobile.mockReturnValue(false);
    
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
  });

  it('renders with undefined positions', () => {
    render(
      <Matrix3D
        entities={mockEntities}
        positions={undefined}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
    expect(screen.getByText('Matrix Scene (1 entities)')).toBeInTheDocument();
  });

  it('renders with null positions', () => {
    render(
      <Matrix3D
        entities={mockEntities}
        positions={null as any}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
    expect(screen.getByText('Matrix Scene (1 entities)')).toBeInTheDocument();
  });

  it('renders with selected entity', () => {
    render(
      <Matrix3D
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={mockEntities[0]}
        onEntitySelect={jest.fn()}
      />
    );
    
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
    expect(screen.getByText('Matrix Scene (1 entities)')).toBeInTheDocument();
  });

  it('renders with onEntitySelect callback', () => {
    const mockOnEntitySelect = jest.fn();
    
    render(
      <Matrix3D
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={mockOnEntitySelect}
      />
    );
    
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
    expect(screen.getByText('Matrix Scene (1 entities)')).toBeInTheDocument();
  });

  it('renders with multiple entities', () => {
    const multipleEntities = [
      ...mockEntities,
      {
        id: 'entity-2',
        name: 'Test Entity 2',
        type: 'System' as const,
        properties: {},
        lastSeen: '2023-01-01T12:00:00Z',
        changesToday: 3,
      },
    ];
    
    render(
      <Matrix3D
        entities={multipleEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    
    expect(screen.getByText('Matrix Scene (2 entities)')).toBeInTheDocument();
  });

  it('renders with empty positions array', () => {
    render(
      <Matrix3D
        entities={mockEntities}
        positions={[]}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
    expect(screen.getByText('Matrix Scene (1 entities)')).toBeInTheDocument();
  });

  it('renders with complex position data', () => {
    const complexPositions = [
      {
        entity_id: 'entity-1',
        matrix_position: { x: 1, y: 2, z: 3 },
        entity_type: 'Threat',
        name: 'Test Entity',
        timeline_position: { x: 0, y: 0, z: 0 },
        network_position: { x: 0, y: 0, z: 0 },
        change_particles: [],
      },
    ];
    
    render(
      <Matrix3D
        entities={mockEntities}
        positions={complexPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
    expect(screen.getByText('Matrix Scene (1 entities)')).toBeInTheDocument();
  });

  it('renders with mobile camera configuration', () => {
    mockUseIsMobile.mockReturnValue(true);
    
    render(
      <Matrix3D
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });

  it('renders with desktop camera configuration', () => {
    mockUseIsMobile.mockReturnValue(false);
    
    render(
      <Matrix3D
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });
});
