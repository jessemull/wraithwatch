import React from 'react';
import { render, screen } from '@testing-library/react';
import { NetworkGraph3D } from '../NetworkGraph3D';
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
jest.mock('../NetworkScene', () => ({
  NetworkScene: ({ entities, positions }: any) => (
    <div data-testid="network-scene">
      Network Scene ({entities.length} entities, {positions.length} positions)
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
  useIsMobile: () => false,
}));
jest.mock('../../../../constants/visualization', () => ({
  CANVAS_STYLE: { width: '100%', height: '100%' },
  CONTROLS_CONFIG: { zoomFactor: 1.2 },
  MOBILE_CONTROLS_CONFIG: { zoomFactor: 1.5 },
  MOBILE_NETWORK_CAMERA_CONFIG: { position: [0, 0, 20], fov: 60 },
}));
describe('NetworkGraph3D', () => {
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
      network_position: { x: 0, y: 0, z: 0 },
    },
  ];
  it('renders NetworkGraph3D component with canvas and controls', () => {
    render(
      <NetworkGraph3D
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
    expect(screen.getByTestId('orbit-controls')).toBeInTheDocument();
    expect(screen.getByTestId('network-scene')).toBeInTheDocument();
    expect(screen.getByTestId('control-panel')).toBeInTheDocument();
  });
  it('renders with correct number of entities and positions', () => {
    render(
      <NetworkGraph3D
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(
      screen.getByText('Network Scene (1 entities, 1 positions)')
    ).toBeInTheDocument();
  });
  it('renders control panel with zoom and reset buttons', () => {
    render(
      <NetworkGraph3D
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
      <NetworkGraph3D
        entities={[]}
        positions={[]}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(
      screen.getByText('Network Scene (0 entities, 0 positions)')
    ).toBeInTheDocument();
  });
  it('renders with selected entity', () => {
    render(
      <NetworkGraph3D
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={mockEntities[0]}
        onEntitySelect={jest.fn()}
      />
    );
    expect(screen.getByTestId('network-scene')).toBeInTheDocument();
  });
});
