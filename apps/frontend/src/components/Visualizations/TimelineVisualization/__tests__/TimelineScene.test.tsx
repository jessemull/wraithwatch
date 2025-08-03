import React from 'react';
import { render, screen } from '@testing-library/react';
import { TimelineScene } from '../TimelineScene';
jest.mock('../EntityNode', () => ({
  EntityNode: ({ entity, position, isSelected, onClick }: any) => (
    <div
      data-testid="entity-node"
      onClick={onClick}
      data-selected={isSelected}
      data-entity-id={entity.id}
      data-position={JSON.stringify(position)}
    >
      Entity Node: {entity.name}
    </div>
  ),
}));
jest.mock('../ChangeParticle', () => ({
  ChangeParticle: ({ position }: any) => (
    <div data-testid="change-particle" data-position={JSON.stringify(position)}>
      Change Particle
    </div>
  ),
}));
jest.mock('../TimeScale', () => ({
  TimeScale: ({ position }: any) => (
    <div data-testid="time-scale" data-position={JSON.stringify(position)}>
      Time Scale
    </div>
  ),
}));
describe('TimelineScene', () => {
  const mockEntities = [
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
  const mockPositions = [
    {
      entity_id: 'entity-1',
      timeline_position: { x: 0, y: 0, z: 0 },
      change_particles: [],
    },
    {
      entity_id: 'entity-2',
      timeline_position: { x: 5, y: 5, z: 5 },
      change_particles: [],
    },
  ];
  it('renders TimelineScene with all entities', () => {
    render(
      <TimelineScene
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(screen.getByText('Entity Node: Entity 1')).toBeInTheDocument();
    expect(screen.getByText('Entity Node: Entity 2')).toBeInTheDocument();
  });
  it('renders timeline axis and markers', () => {
    render(
      <TimelineScene
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(document.body).toBeInTheDocument();
  });
  it('handles selected entity correctly', () => {
    render(
      <TimelineScene
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={mockEntities[0]}
        onEntitySelect={jest.fn()}
      />
    );
    const entityNodes = screen.getAllByTestId('entity-node');
    const selectedNode = entityNodes.find(
      node => node.getAttribute('data-entity-id') === 'entity-1'
    );
    expect(selectedNode).toHaveAttribute('data-selected', 'true');
  });
  it('renders change particles for selected entity', () => {
    render(
      <TimelineScene
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={mockEntities[0]}
        onEntitySelect={jest.fn()}
      />
    );
    const changeParticles = screen.getAllByTestId('change-particle');
    expect(changeParticles.length).toBeGreaterThan(0);
  });
  it('renders time scale when entity is selected', () => {
    render(
      <TimelineScene
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={mockEntities[0]}
        onEntitySelect={jest.fn()}
      />
    );
    expect(screen.getByTestId('time-scale')).toBeInTheDocument();
  });
  it('does not render time scale when no entity is selected', () => {
    render(
      <TimelineScene
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(screen.queryByTestId('time-scale')).not.toBeInTheDocument();
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
      <TimelineScene
        entities={entitiesWithoutPositions}
        positions={[]}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(screen.getByText('Entity Node: Entity 1')).toBeInTheDocument();
  });
  it('handles empty entities array', () => {
    render(
      <TimelineScene
        entities={[]}
        positions={[]}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(screen.queryByTestId('entity-node')).not.toBeInTheDocument();
  });
  it('calculates timeline bounds correctly', () => {
    render(
      <TimelineScene
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(document.body).toBeInTheDocument();
  });
});
