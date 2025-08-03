import React from 'react';
import { render, screen } from '@testing-library/react';
import { NetworkScene } from '../NetworkScene';
jest.mock('../NetworkNode', () => ({
  NetworkNode: ({ entity, position, isSelected, onClick }: any) => (
    <div
      data-testid="network-node"
      onClick={onClick}
      data-selected={isSelected}
      data-entity-id={entity.id}
      data-position={JSON.stringify(position)}
    >
      Network Node: {entity.name}
    </div>
  ),
}));
jest.mock('../ConnectionLine', () => ({
  ConnectionLine: ({ start, end, strength, type }: any) => (
    <div
      data-testid="connection-line"
      data-start={JSON.stringify(start)}
      data-end={JSON.stringify(end)}
      data-strength={strength}
      data-type={type}
    >
      Connection Line
    </div>
  ),
}));
jest.mock('../ConnectionParticle', () => ({
  ConnectionParticle: ({ start, end, type, speed, particleCount }: any) => (
    <div
      data-testid="connection-particle"
      data-start={JSON.stringify(start)}
      data-end={JSON.stringify(end)}
      data-type={type}
      data-speed={speed}
      data-particle-count={particleCount}
    >
      Connection Particle
    </div>
  ),
}));
jest.mock('../../../../constants/visualization', () => ({
  NETWORK_SCENE_CONFIG: {
    connectionRules: {
      aiAgentToSystem: { strength: 0.8, type: 'agent' },
      userToSystem: { strength: 0.6, type: 'location' },
      threatToSystem: { strength: 0.9, type: 'type' },
      networkNodeToSystem: { strength: 0.7, type: 'network' },
      userToNetworkNode: { strength: 0.5, type: 'location' },
    },
    fallbackConnections: [
      { strength: 0.5, type: 'type' },
      { strength: 0.6, type: 'location' },
    ],
  },
}));
describe('NetworkScene', () => {
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
  const mockEntities = [
    {
      id: 'ai-1',
      name: 'AI Agent 1',
      type: 'AI_Agent' as const,
      properties: {},
      lastSeen: '2023-01-01T12:00:00Z',
      changesToday: 5,
    },
    {
      id: 'system-1',
      name: 'System 1',
      type: 'System' as const,
      properties: {},
      lastSeen: '2023-01-01T12:00:00Z',
      changesToday: 3,
    },
    {
      id: 'user-1',
      name: 'User 1',
      type: 'User' as const,
      properties: {},
      lastSeen: '2023-01-01T12:00:00Z',
      changesToday: 2,
    },
    {
      id: 'threat-1',
      name: 'Threat 1',
      type: 'Threat' as const,
      properties: {},
      lastSeen: '2023-01-01T12:00:00Z',
      changesToday: 8,
    },
  ];
  const mockPositions = [
    {
      entity_id: 'ai-1',
      network_position: { x: 0, y: 0, z: 0 },
    },
    {
      entity_id: 'system-1',
      network_position: { x: 5, y: 0, z: 0 },
    },
    {
      entity_id: 'user-1',
      network_position: { x: 0, y: 5, z: 0 },
    },
    {
      entity_id: 'threat-1',
      network_position: { x: 5, y: 5, z: 0 },
    },
  ];
  it('renders NetworkScene with all entities', () => {
    render(
      <NetworkScene
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(screen.getByText('Network Node: AI Agent 1')).toBeInTheDocument();
    expect(screen.getByText('Network Node: System 1')).toBeInTheDocument();
    expect(screen.getByText('Network Node: User 1')).toBeInTheDocument();
    expect(screen.getByText('Network Node: Threat 1')).toBeInTheDocument();
  });
  it('renders connection lines between entities', () => {
    render(
      <NetworkScene
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    const connectionLines = screen.getAllByTestId('connection-line');
    expect(connectionLines.length).toBeGreaterThan(0);
  });
  it('renders connection particles', () => {
    render(
      <NetworkScene
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    const connectionParticles = screen.getAllByTestId('connection-particle');
    expect(connectionParticles.length).toBeGreaterThan(0);
  });
  it('handles selected entity correctly', () => {
    render(
      <NetworkScene
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={mockEntities[0]}
        onEntitySelect={jest.fn()}
      />
    );
    const networkNodes = screen.getAllByTestId('network-node');
    const selectedNode = networkNodes.find(
      node => node.getAttribute('data-entity-id') === 'ai-1'
    );
    expect(selectedNode).toHaveAttribute('data-selected', 'true');
  });
  it('handles entities without position data', () => {
    const entitiesWithoutPositions = [
      {
        id: 'entity-1',
        name: 'Entity 1',
        type: 'System' as const,
        properties: {},
        lastSeen: '2023-01-01T12:00:00Z',
        changesToday: 5,
      },
    ];
    render(
      <NetworkScene
        entities={entitiesWithoutPositions}
        positions={[]}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(screen.getByText('Network Node: Entity 1')).toBeInTheDocument();
  });
  it('handles empty entities array', () => {
    render(
      <NetworkScene
        entities={[]}
        positions={[]}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(screen.queryByTestId('network-node')).not.toBeInTheDocument();
  });
  it('groups entities by type correctly', () => {
    render(
      <NetworkScene
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(screen.getByText('Network Node: AI Agent 1')).toBeInTheDocument();
    expect(screen.getByText('Network Node: System 1')).toBeInTheDocument();
    expect(screen.getByText('Network Node: User 1')).toBeInTheDocument();
    expect(screen.getByText('Network Node: Threat 1')).toBeInTheDocument();
  });
});
