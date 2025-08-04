import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimelineVisualization } from '../TimelineVisualization';

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

jest.mock('../TimelineScene', () => ({
  TimelineScene: ({ entities, positions }: any) => (
    <div data-testid="timeline-scene">
      Timeline Scene ({entities?.length || 0} entities, {positions?.length || 0}{' '}
      positions)
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
  useIsMobile: jest.fn(() => false),
}));

const mockEntities = [
  {
    id: 'entity-1',
    name: 'Test Entity 1',
    type: 'System',
    changesToday: 5,
    lastSeen: new Date().toISOString(),
    properties: {},
  },
  {
    id: 'entity-2',
    name: 'Test Entity 2',
    type: 'User',
    changesToday: 3,
    lastSeen: new Date().toISOString(),
    properties: {},
  },
];

const mockPositions = [
  {
    entity_id: 'entity-1',
    entity_type: 'System',
    name: 'Test Entity 1',
    timeline_position: { x: 0, y: 0, z: 0 },
    network_position: { x: 0, y: 0, z: 0 },
    change_particles: [],
  },
  {
    entity_id: 'entity-2',
    entity_type: 'User',
    name: 'Test Entity 2',
    timeline_position: { x: 100, y: 100, z: 100 },
    network_position: { x: 100, y: 100, z: 100 },
    change_particles: [],
  },
];

describe('TimelineVisualization', () => {
  it('renders timeline visualization with canvas', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
      />
    );

    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });

  it('renders orbit controls', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
      />
    );

    expect(screen.getByTestId('orbit-controls')).toBeInTheDocument();
  });

  it('renders timeline scene with entities and positions', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '2 entities'
    );
    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '2 positions'
    );
  });

  it('renders control panel', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
      />
    );

    expect(screen.getByTestId('control-panel')).toBeInTheDocument();
  });

  it('renders zoom controls', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
      />
    );

    expect(screen.getByTestId('zoom-in')).toBeInTheDocument();
    expect(screen.getByTestId('zoom-out')).toBeInTheDocument();
    expect(screen.getByTestId('reset')).toBeInTheDocument();
  });

  it('handles zoom in button click', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
      />
    );

    const zoomInButton = screen.getByTestId('zoom-in');
    fireEvent.click(zoomInButton);
  });

  it('handles zoom out button click', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
      />
    );

    const zoomOutButton = screen.getByTestId('zoom-out');
    fireEvent.click(zoomOutButton);
  });

  it('handles reset button click', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
      />
    );

    const resetButton = screen.getByTestId('reset');
    fireEvent.click(resetButton);
  });

  it('handles empty entities array', () => {
    render(<TimelineVisualization entities={[]} positions={mockPositions} />);

    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '0 entities'
    );
  });

  it('handles empty positions array', () => {
    render(<TimelineVisualization entities={mockEntities} positions={[]} />);

    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '0 positions'
    );
  });

  it('handles undefined entities', () => {
    render(
      <TimelineVisualization
        entities={undefined as any}
        positions={mockPositions}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '0 entities'
    );
  });

  it('handles undefined positions', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={undefined as any}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '0 positions'
    );
  });

  it('handles null entities', () => {
    render(
      <TimelineVisualization entities={null as any} positions={mockPositions} />
    );

    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '0 entities'
    );
  });

  it('handles null positions', () => {
    render(
      <TimelineVisualization entities={mockEntities} positions={null as any} />
    );

    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '0 positions'
    );
  });

  it('handles selected entity', () => {
    const selectedEntity = mockEntities[0];
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={selectedEntity}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toBeInTheDocument();
  });

  it('handles entity selection callback', () => {
    const onEntitySelect = jest.fn();
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
        onEntitySelect={onEntitySelect}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toBeInTheDocument();
  });

  it('handles undefined selected entity', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toBeInTheDocument();
  });

  it('handles undefined onEntitySelect callback', () => {
    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={mockPositions}
        onEntitySelect={undefined}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toBeInTheDocument();
  });

  it('handles large entities array', () => {
    const largeEntities = Array.from({ length: 100 }, (_, i) => ({
      id: `entity-${i}`,
      name: `Test Entity ${i}`,
      type: 'System',
      changesToday: i,
      lastSeen: new Date().toISOString(),
      properties: {},
    }));

    render(
      <TimelineVisualization
        entities={largeEntities}
        positions={mockPositions}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '100 entities'
    );
  });

  it('handles large positions array', () => {
    const largePositions = Array.from({ length: 100 }, (_, i) => ({
      entity_id: `entity-${i}`,
      entity_type: 'System',
      name: `Test Entity ${i}`,
      timeline_position: { x: i, y: i, z: i },
      network_position: { x: i, y: i, z: i },
      change_particles: [],
    }));

    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={largePositions}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '100 positions'
    );
  });

  it('handles entities with complex properties', () => {
    const complexEntities = [
      {
        id: 'entity-1',
        name: 'Complex Entity',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {
          cpu_usage: {
            name: 'CPU Usage',
            currentValue: 75,
            lastChanged: new Date().toISOString(),
            history: [],
          },
          memory_usage: {
            name: 'Memory Usage',
            currentValue: 60,
            lastChanged: new Date().toISOString(),
            history: [],
          },
          network_status: {
            name: 'Network Status',
            currentValue: 'active',
            lastChanged: new Date().toISOString(),
            history: [],
          },
          security_level: {
            name: 'Security Level',
            currentValue: 'high',
            lastChanged: new Date().toISOString(),
            history: [],
          },
        },
      },
    ];

    render(
      <TimelineVisualization
        entities={complexEntities}
        positions={mockPositions}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '1 entities'
    );
  });

  it('handles positions with complex coordinates', () => {
    const complexPositions = [
      {
        entity_id: 'entity-1',
        entity_type: 'System',
        name: 'Complex Entity',
        timeline_position: { x: 123.456, y: -789.012, z: 0.001 },
        network_position: { x: -456.789, y: 123.456, z: 999.999 },
        change_particles: [],
      },
    ];

    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={complexPositions}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '1 positions'
    );
  });

  it('handles entities with null properties', () => {
    const entitiesWithNullProps = [
      {
        id: 'entity-1',
        name: 'Entity with Null Props',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: undefined,
      },
    ];

    render(
      <TimelineVisualization
        entities={entitiesWithNullProps}
        positions={mockPositions}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '1 entities'
    );
  });

  it('handles positions with null change particles', () => {
    const positionsWithNullParticles = [
      {
        entity_id: 'entity-1',
        entity_type: 'System',
        name: 'Entity with Null Particles',
        timeline_position: { x: 0, y: 0, z: 0 },
        network_position: { x: 0, y: 0, z: 0 },
        change_particles: [],
      },
    ];

    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={positionsWithNullParticles}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '1 positions'
    );
  });

  it('handles entities with undefined properties', () => {
    const entitiesWithUndefinedProps = [
      {
        id: 'entity-1',
        name: 'Entity with Undefined Props',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: undefined,
      },
    ];

    render(
      <TimelineVisualization
        entities={entitiesWithUndefinedProps}
        positions={mockPositions}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '1 entities'
    );
  });

  it('handles positions with undefined change particles', () => {
    const positionsWithUndefinedParticles = [
      {
        entity_id: 'entity-1',
        entity_type: 'System',
        name: 'Entity with Undefined Particles',
        timeline_position: { x: 0, y: 0, z: 0 },
        network_position: { x: 0, y: 0, z: 0 },
        change_particles: [],
      },
    ];

    render(
      <TimelineVisualization
        entities={mockEntities}
        positions={positionsWithUndefinedParticles}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '1 positions'
    );
  });

  it('handles entities with zero changes today', () => {
    const entitiesWithZeroChanges = [
      {
        id: 'entity-1',
        name: 'Entity with Zero Changes',
        type: 'System',
        changesToday: 0,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(
      <TimelineVisualization
        entities={entitiesWithZeroChanges}
        positions={mockPositions}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '1 entities'
    );
  });

  it('handles entities with negative changes today', () => {
    const entitiesWithNegativeChanges = [
      {
        id: 'entity-1',
        name: 'Entity with Negative Changes',
        type: 'System',
        changesToday: -5,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(
      <TimelineVisualization
        entities={entitiesWithNegativeChanges}
        positions={mockPositions}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '1 entities'
    );
  });

  it('handles entities with very large changes today', () => {
    const entitiesWithLargeChanges = [
      {
        id: 'entity-1',
        name: 'Entity with Large Changes',
        type: 'System',
        changesToday: 999999,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(
      <TimelineVisualization
        entities={entitiesWithLargeChanges}
        positions={mockPositions}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '1 entities'
    );
  });

  it('handles entities with invalid last seen date', () => {
    const entitiesWithInvalidDate = [
      {
        id: 'entity-1',
        name: 'Entity with Invalid Date',
        type: 'System',
        changesToday: 5,
        lastSeen: 'invalid-date',
        properties: {},
      },
    ];

    render(
      <TimelineVisualization
        entities={entitiesWithInvalidDate}
        positions={mockPositions}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '1 entities'
    );
  });

  it('handles entities with null last seen date', () => {
    const entitiesWithNullDate = [
      {
        id: 'entity-1',
        name: 'Entity with Null Date',
        type: 'System',
        changesToday: 5,
        lastSeen: 'null',
        properties: {},
      },
    ];

    render(
      <TimelineVisualization
        entities={entitiesWithNullDate}
        positions={mockPositions}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '1 entities'
    );
  });

  it('handles entities with undefined last seen date', () => {
    const entitiesWithUndefinedDate = [
      {
        id: 'entity-1',
        name: 'Entity with Undefined Date',
        type: 'System',
        changesToday: 5,
        lastSeen: '',
        properties: {},
      },
    ];

    render(
      <TimelineVisualization
        entities={entitiesWithUndefinedDate}
        positions={mockPositions}
      />
    );

    expect(screen.getByTestId('timeline-scene')).toHaveTextContent(
      '1 entities'
    );
  });
});
