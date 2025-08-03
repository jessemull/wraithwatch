import React from 'react';
import { render, screen } from '@testing-library/react';
import { MatrixScene } from '../MatrixScene';
jest.mock('@react-three/drei', () => ({
  Text: ({ children, fontSize, color }: any) => (
    <div data-testid="text" style={{ position: 'absolute', fontSize, color }}>
      {children}
    </div>
  ),
}));
jest.mock('../MatrixNode', () => ({
  MatrixNode: ({ entity, isSelected, onClick }: any) => (
    <div
      data-testid="matrix-node"
      onClick={onClick}
      data-selected={isSelected}
      data-entity-id={entity.id}
    >
      Matrix Node: {entity.name}
    </div>
  ),
}));
describe('MatrixScene', () => {
  const mockEntities = [
    {
      id: 'threat-1',
      name: 'Test Threat',
      type: 'Threat' as const,
      properties: {},
      lastSeen: '2023-01-01T12:00:00Z',
      changesToday: 5,
    },
    {
      id: 'system-1',
      name: 'Test System',
      type: 'System' as const,
      properties: {},
      lastSeen: '2023-01-01T12:00:00Z',
      changesToday: 2,
    },
  ];
  const mockPositions = [
    {
      entity_id: 'threat-1',
      matrix_position: { x: 0, y: 2, z: 0 },
    },
  ];
  it('renders MatrixScene with lights and grid', () => {
    render(
      <MatrixScene
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(screen.getByText('SEVERITY')).toBeInTheDocument();
    expect(screen.getByText('DETECTION COUNT')).toBeInTheDocument();
    expect(screen.getByText('THREAT SCORE')).toBeInTheDocument();
  });
  it('renders threat severity labels', () => {
    render(
      <MatrixScene
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(screen.getByText('Critical')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
  });
  it('renders threat entities with positions', () => {
    render(
      <MatrixScene
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(screen.getByText('Matrix Node: Test Threat')).toBeInTheDocument();
  });
  it('renders selected entity correctly', () => {
    render(
      <MatrixScene
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={mockEntities[0]}
        onEntitySelect={jest.fn()}
      />
    );
    const matrixNode = screen.getByTestId('matrix-node');
    expect(matrixNode).toHaveAttribute('data-selected', 'true');
    expect(matrixNode).toHaveAttribute('data-entity-id', 'threat-1');
  });
  it('filters to only threat entities', () => {
    render(
      <MatrixScene
        entities={mockEntities}
        positions={mockPositions}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(screen.getByText('Matrix Node: Test Threat')).toBeInTheDocument();
    expect(
      screen.queryByText('Matrix Node: Test System')
    ).not.toBeInTheDocument();
  });
  it('handles missing positions gracefully', () => {
    render(
      <MatrixScene
        entities={mockEntities}
        positions={undefined}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(screen.getByText('SEVERITY')).toBeInTheDocument();
    expect(screen.queryByTestId('matrix-node')).not.toBeInTheDocument();
  });
  it('handles entity without position data', () => {
    const entitiesWithoutPosition = [
      {
        id: 'threat-1',
        name: 'Test Threat',
        type: 'Threat' as const,
        properties: {},
        lastSeen: '2023-01-01T12:00:00Z',
        changesToday: 5,
      },
    ];
    render(
      <MatrixScene
        entities={entitiesWithoutPosition}
        positions={[]}
        selectedEntity={undefined}
        onEntitySelect={jest.fn()}
      />
    );
    expect(screen.getByText('SEVERITY')).toBeInTheDocument();
    expect(screen.queryByTestId('matrix-node')).not.toBeInTheDocument();
  });
});
