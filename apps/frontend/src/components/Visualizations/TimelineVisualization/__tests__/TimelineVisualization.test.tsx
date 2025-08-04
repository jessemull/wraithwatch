import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimelineVisualization } from '../TimelineVisualization';
import { useIsMobile } from '../../../../hooks/useRealTimeData';

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children, style, camera }: any) => (
    <div
      data-testid="canvas"
      style={style}
      data-camera={JSON.stringify(camera)}
    >
      {children}
    </div>
  ),
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: ({ ...props }: any) => (
    <div data-testid="orbit-controls" {...props} />
  ),
}));

jest.mock('../TimelineScene', () => ({
  TimelineScene: ({
    entities,
    positions,
    selectedEntity,
    onEntitySelect,
  }: any) => (
    <div data-testid="timeline-scene">
      Timeline Scene ({entities?.length || 0} entities, {positions?.length || 0}{' '}
      positions)
      {selectedEntity && (
        <div data-testid="selected-entity">{selectedEntity.id}</div>
      )}
      <button
        onClick={() => onEntitySelect?.(entities?.[0])}
        data-testid="select-entity"
      >
        Select Entity
      </button>
    </div>
  ),
}));

jest.mock('../ControlPanel', () => ({
  ControlPanel: ({ onZoomIn, onZoomOut, onReset }: any) => (
    <div data-testid="control-panel">
      <button onClick={onZoomIn} data-testid="zoom-in">
        Zoom In
      </button>
      <button onClick={onZoomOut} data-testid="zoom-out">
        Zoom Out
      </button>
      <button onClick={onReset} data-testid="reset">
        Reset
      </button>
    </div>
  ),
}));

jest.mock('../../../../hooks/useRealTimeData', () => ({
  useIsMobile: jest.fn(),
}));

jest.mock('../../../../constants/visualization', () => ({
  CAMERA_CONFIG: { position: [0, 0, 10], fov: 60 },
  MOBILE_CAMERA_CONFIG: { position: [0, 0, 15], fov: 60 },
  LIGHTING_CONFIG: {
    ambient: { intensity: 0.6 },
    pointLights: [
      { position: [10, 10, 10], intensity: 1 },
      { position: [-10, -10, -10], intensity: 0.5 },
    ],
  },
  CONTROLS_CONFIG: { zoomFactor: 1.2 },
  MOBILE_CONTROLS_CONFIG: { zoomFactor: 1.5 },
  CANVAS_STYLE: { width: '100%', height: '100%' },
}));

describe('TimelineVisualization', () => {
  let originalError: typeof console.error;
  let originalWarn: typeof console.warn;
  const mockUseIsMobile = useIsMobile as jest.MockedFunction<
    typeof useIsMobile
  >;

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

  beforeEach(() => {
    mockUseIsMobile.mockReturnValue(false);
  });

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
      change_particles: [],
    },
  ];

  it('renders TimelineVisualization component with canvas and controls', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
    expect(screen.getByTestId('orbit-controls')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-scene')).toBeInTheDocument();
    expect(screen.getByTestId('control-panel')).toBeInTheDocument();
  });

  it('renders with correct number of entities and positions', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(
      screen.getByText('Timeline Scene (1 entities, 1 positions)')
    ).toBeInTheDocument();
  });

  it('renders control panel with zoom and reset buttons', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(screen.getByTestId('zoom-in')).toBeInTheDocument();
    expect(screen.getByTestId('zoom-out')).toBeInTheDocument();
    expect(screen.getByTestId('reset')).toBeInTheDocument();
  });

  it('renders with empty entities array', () => {
    render(
      <TimelineVisualization
        entities={[]}
        positions={[]}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(
      screen.getByText('Timeline Scene (0 entities, 0 positions)')
    ).toBeInTheDocument();
  });

  it('renders with selected entity', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={mockEntities[0]}
        onEntitySelect={jest.fn()}
      />
    );
    expect(screen.getByTestId('timeline-scene')).toBeInTheDocument();
    expect(screen.getByTestId('selected-entity')).toBeInTheDocument();
    expect(screen.getByText('entity-1')).toBeInTheDocument();
  });

  it('uses mobile camera config when mobile', () => {
    mockUseIsMobile.mockReturnValue(true);

    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );

    const canvas = screen.getByTestId('canvas');
    const cameraData = JSON.parse(canvas.getAttribute('data-camera') || '{}');
    expect(cameraData.position).toEqual([0, 0, 15]);
    expect(cameraData.fov).toBe(60);
  });

  it('renders with multiple entities and positions', () => {
    const multipleEntities = [
      {
        id: 'entity-1',
        name: 'Entity 1',
        type: 'System' as const,
        properties: {},
        lastSeen: '2023-01-01T12:00:00Z',
        changesToday: 5,
      },
      {
        id: 'entity-2',
        name: 'Entity 2',
        type: 'User' as const,
        properties: {},
        lastSeen: '2023-01-01T12:00:00Z',
        changesToday: 3,
      },
    ];
    const multiplePositions = [
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
        timeline_position: { x: 10, y: 10, z: 10 },
        network_position: { x: 10, y: 10, z: 10 },
        change_particles: [],
      },
    ];

    render(
      <TimelineVisualization
        entities={multipleEntities}
        positions={multiplePositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );

    expect(
      screen.getByText('Timeline Scene (2 entities, 2 positions)')
    ).toBeInTheDocument();
  });

  it('calls onEntitySelect when entity is selected', () => {
    const mockOnEntitySelect = jest.fn();

    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={mockOnEntitySelect}
      />
    );

    const selectButton = screen.getByTestId('select-entity');
    fireEvent.click(selectButton);

    expect(mockOnEntitySelect).toHaveBeenCalledWith(mockEntities[0]);
  });

  it('handles undefined onEntitySelect prop', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={undefined}
      />
    );

    const selectButton = screen.getByTestId('select-entity');
    expect(() => fireEvent.click(selectButton)).not.toThrow();
  });

  it('renders with undefined selectedEntity', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );

    expect(screen.queryByTestId('selected-entity')).not.toBeInTheDocument();
  });

  it('renders with null selectedEntity', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={null as any}
        onEntitySelect={jest.fn()}
      />
    );

    expect(screen.queryByTestId('selected-entity')).not.toBeInTheDocument();
  });

  it('renders with empty positions array', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={[]}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );

    expect(
      screen.getByText('Timeline Scene (1 entities, 0 positions)')
    ).toBeInTheDocument();
  });

  it('renders with undefined positions', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={undefined as any}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );

    expect(
      screen.getByText('Timeline Scene (1 entities, 0 positions)')
    ).toBeInTheDocument();
  });

  it('renders with null positions', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={null as any}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );

    expect(
      screen.getByText('Timeline Scene (1 entities, 0 positions)')
    ).toBeInTheDocument();
  });
});
