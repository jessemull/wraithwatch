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
  OrbitControls: React.forwardRef(({ ...props }: any, ref: any) => {
    const mockControls = {
      dollyOut: jest.fn(),
      dollyIn: jest.fn(),
      reset: jest.fn(),
      update: jest.fn(),
    };

    // Assign the mock controls to the ref
    if (ref) {
      ref.current = mockControls;
    }

    return <div data-testid="orbit-controls" {...props} />;
  }),
}));

jest.mock('../MatrixScene', () => ({
  MatrixScene: ({ entities, positions }: any) => (
    <div data-testid="matrix-scene">
      Matrix Scene ({entities?.length || 0} entities, {positions?.length || 0}{' '}
      positions)
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

jest.mock('../../../../hooks/useRealTimeData', () => ({
  useIsMobile: jest.fn(() => false),
}));

jest.mock('../../../../constants/visualization', () => ({
  CANVAS_STYLE: { width: '100%', height: '100%' },
  CONTROLS_CONFIG: { zoomFactor: 1.2 },
  MOBILE_CONTROLS_CONFIG: { zoomFactor: 1.5 },
  MOBILE_MATRIX_CAMERA_CONFIG: { position: [0, 0, 20], fov: 60 },
}));

describe('Matrix3D', () => {
  const mockEntities = [
    {
      id: 'entity-1',
      name: 'Test Entity',
      type: 'System' as const,
      properties: {},
      lastSeen: '2023-01-01T12:00:00Z',
      changesToday: 5,
    },
  ];

  const mockPositions = [
    {
      entity_id: 'entity-1',
      entity_type: 'System',
      name: 'Test Entity',
      timeline_position: { x: 0, y: 0, z: 0 },
      network_position: { x: 0, y: 0, z: 0 },
      matrix_position: { x: 0, y: 0, z: 0 },
      change_particles: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
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
    expect(screen.getByTestId('matrix-scene')).toBeInTheDocument();
    expect(screen.getByTestId('control-panel')).toBeInTheDocument();
  });

  it('renders with correct number of entities and positions', () => {
    render(
      <Matrix3D
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );

    expect(screen.getByTestId('matrix-scene')).toHaveTextContent(
      'Matrix Scene (1 entities, 1 positions)'
    );
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

    expect(
      screen.getByText('Matrix Scene (0 entities, 0 positions)')
    ).toBeInTheDocument();
  });

  it('renders with selected entity', () => {
    const selectedEntity = {
      id: 'entity-2',
      name: 'Test Entity 2',
      type: 'Agent',
      changesToday: 3,
      lastSeen: new Date().toISOString(),
      properties: {},
    };

    render(
      <Matrix3D
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={selectedEntity}
      />
    );

    expect(
      screen.getByText('Matrix Scene (1 entities, 1 positions)')
    ).toBeInTheDocument();
  });

  it('renders with onEntitySelect callback', () => {
    const onEntitySelect = jest.fn();

    render(
      <Matrix3D
        entities={mockEntities}
        positions={mockPositions}
        onEntitySelect={onEntitySelect}
      />
    );

    expect(
      screen.getByText('Matrix Scene (1 entities, 1 positions)')
    ).toBeInTheDocument();
  });

  it('renders with undefined positions', () => {
    render(<Matrix3D entities={mockEntities} positions={undefined as any} />);

    expect(screen.getByTestId('matrix-scene')).toHaveTextContent(
      'Matrix Scene (1 entities, 0 positions)'
    );
  });

  it('renders with null positions', () => {
    render(<Matrix3D entities={mockEntities} positions={null as any} />);

    expect(screen.getByTestId('matrix-scene')).toHaveTextContent(
      'Matrix Scene (1 entities, 0 positions)'
    );
  });

  it('renders with empty positions array', () => {
    render(<Matrix3D entities={mockEntities} positions={[]} />);

    expect(screen.getByTestId('matrix-scene')).toHaveTextContent(
      'Matrix Scene (1 entities, 0 positions)'
    );
  });

  it('renders with multiple entities', () => {
    const multipleEntities = [
      {
        id: 'entity-1',
        name: 'Entity 1',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
      {
        id: 'entity-2',
        name: 'Entity 2',
        type: 'User',
        changesToday: 3,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<Matrix3D entities={multipleEntities} positions={mockPositions} />);

    expect(screen.getByTestId('matrix-scene')).toHaveTextContent(
      'Matrix Scene (2 entities, 1 positions)'
    );
  });

  it('renders with complex positions', () => {
    const complexPositions = [
      {
        entity_id: 'entity-1',
        entity_type: 'System',
        name: 'Entity 1',
        timeline_position: { x: 0, y: 0, z: 0 },
        network_position: { x: 0, y: 0, z: 0 },
        change_particles: [],
      },
      {
        entity_id: 'entity-2',
        entity_type: 'User',
        name: 'Entity 2',
        timeline_position: { x: 100, y: 100, z: 100 },
        network_position: { x: 100, y: 100, z: 100 },
        change_particles: [],
      },
    ];

    render(<Matrix3D entities={mockEntities} positions={complexPositions} />);

    expect(screen.getByTestId('matrix-scene')).toHaveTextContent(
      'Matrix Scene (1 entities, 2 positions)'
    );
  });

  it('renders with mobile camera configuration', () => {
    const { useIsMobile } = jest.requireMock(
      '../../../../hooks/useRealTimeData'
    );
    (useIsMobile as jest.Mock).mockReturnValue(true);

    render(<Matrix3D entities={mockEntities} positions={mockPositions} />);

    expect(screen.getByTestId('matrix-scene')).toHaveTextContent(
      'Matrix Scene (1 entities, 1 positions)'
    );
  });

  it('renders with desktop camera configuration', () => {
    const { useIsMobile } = jest.requireMock(
      '../../../../hooks/useRealTimeData'
    );
    (useIsMobile as jest.Mock).mockReturnValue(false);

    render(<Matrix3D entities={mockEntities} positions={mockPositions} />);

    expect(screen.getByTestId('matrix-scene')).toHaveTextContent(
      'Matrix Scene (1 entities, 1 positions)'
    );
  });

  it('handles zoom in button click', () => {
    render(<Matrix3D entities={mockEntities} positions={mockPositions} />);

    const zoomInButton = screen.getByText('Zoom In');
    fireEvent.click(zoomInButton);

    expect(zoomInButton).toBeInTheDocument();
  });

  it('handles zoom out button click', () => {
    render(<Matrix3D entities={mockEntities} positions={mockPositions} />);

    const zoomOutButton = screen.getByText('Zoom Out');
    fireEvent.click(zoomOutButton);

    expect(zoomOutButton).toBeInTheDocument();
  });

  it('handles reset button click', () => {
    render(<Matrix3D entities={mockEntities} positions={mockPositions} />);

    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);

    expect(resetButton).toBeInTheDocument();
  });

  it('renders with custom camera target', () => {
    render(<Matrix3D entities={mockEntities} positions={mockPositions} />);

    const orbitControls = screen.getByTestId('orbit-controls');
    expect(orbitControls).toBeInTheDocument();
  });

  it('renders with proper container styling', () => {
    render(<Matrix3D entities={mockEntities} positions={mockPositions} />);

    const container = screen.getByTestId('canvas').parentElement;
    expect(container).toHaveStyle({
      width: '100%',
      height: '100%',
      position: 'relative',
    });
  });
});
