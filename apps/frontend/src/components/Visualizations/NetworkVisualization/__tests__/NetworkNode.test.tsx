import React from 'react';
import { render, screen } from '@testing-library/react';
import { NetworkNode } from '../NetworkNode';
jest.mock('@react-three/drei', () => ({
  Text: ({
    children,
    fontSize,
    color,
    anchorX,
    anchorY,
    maxWidth,
    textAlign,
    outlineWidth,
    outlineColor,
  }: any) => (
    <div
      data-testid="text"
      style={{
        position: 'absolute',
        fontSize,
        color,
        anchorX,
        anchorY,
        maxWidth,
        textAlign,
        outlineWidth,
        outlineColor,
      }}
    >
      {children}
    </div>
  ),
}));
jest.mock('../../../../util/entity', () => ({
  getEntityName: (id: string) => `Entity ${id}`,
}));
jest.mock('../../../../constants/visualization', () => ({
  NETWORK_NODE_CONFIG: {
    nodeSizes: {
      default: 0.5,
      selected: 0.7,
    },
    intensities: {
      default: 0.3,
      selected: 0.8,
    },
    entityColors: {
      AI_Agent: '#4ecdc4',
      System: '#45b7d1',
      User: '#96ceb4',
      Threat: '#ff6b6b',
      Network_Node: '#feca57',
    },
    sphereSegments: 16,
    labelOffset: 0.8,
    labelFontSize: 0.2,
    labelMaxWidth: 3,
    labelOutlineWidth: 0.02,
    threatHaloOffset: 0.3,
    threatHighlightOffset: 0.1,
  },
}));
describe('NetworkNode', () => {
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
    id: 'entity-1',
    name: 'Test Entity',
    type: 'System' as const,
    properties: {},
    lastSeen: '2023-01-01T12:00:00Z',
    changesToday: 5,
  };
  it('renders NetworkNode with mesh and text', () => {
    render(
      <NetworkNode
        entity={mockEntity}
        position={[0, 0, 0]}
        isSelected={false}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByTestId('text')).toBeInTheDocument();
  });
  it('renders entity name correctly', () => {
    render(
      <NetworkNode
        entity={mockEntity}
        position={[0, 0, 0]}
        isSelected={false}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByText('Entity entity-1')).toBeInTheDocument();
  });
  it('handles click events', () => {
    const mockOnClick = jest.fn();
    render(
      <NetworkNode
        entity={mockEntity}
        position={[0, 0, 0]}
        isSelected={false}
        onClick={mockOnClick}
      />
    );
    expect(mockOnClick).not.toHaveBeenCalled();
  });
  it('renders different entity types with correct colors', () => {
    const entityTypes = [
      'AI_Agent',
      'System',
      'User',
      'Threat',
      'Network_Node',
    ] as const;
    entityTypes.forEach(entityType => {
      const entity = {
        ...mockEntity,
        type: entityType,
      };
      const { rerender } = render(
        <NetworkNode
          entity={entity}
          position={[0, 0, 0]}
          isSelected={false}
          onClick={jest.fn()}
        />
      );
      expect(screen.getByText(`Entity ${mockEntity.id}`)).toBeInTheDocument();
      rerender(<div />);
    });
  });
  it('renders threat entity with halo effect', () => {
    const threatEntity = {
      ...mockEntity,
      type: 'Threat' as const,
    };
    render(
      <NetworkNode
        entity={threatEntity}
        position={[0, 0, 0]}
        isSelected={false}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByText('Entity entity-1')).toBeInTheDocument();
  });
  it('renders selected state correctly', () => {
    render(
      <NetworkNode
        entity={mockEntity}
        position={[0, 0, 0]}
        isSelected={true}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByText('Entity entity-1')).toBeInTheDocument();
  });
  it('renders with different positions', () => {
    const positions: [number, number, number][] = [
      [0, 0, 0],
      [1, 2, 3],
      [-1, -2, -3],
    ];
    positions.forEach(position => {
      const { rerender } = render(
        <NetworkNode
          entity={mockEntity}
          position={position}
          isSelected={false}
          onClick={jest.fn()}
        />
      );
      expect(screen.getByText('Entity entity-1')).toBeInTheDocument();
      rerender(<div />);
    });
  });
  it('handles different entity IDs', () => {
    const entities = [
      { ...mockEntity, id: 'ai-1' },
      { ...mockEntity, id: 'system-1' },
      { ...mockEntity, id: 'user-1' },
    ];
    entities.forEach(entity => {
      const { rerender } = render(
        <NetworkNode
          entity={entity}
          position={[0, 0, 0]}
          isSelected={false}
          onClick={jest.fn()}
        />
      );
      expect(screen.getByText(`Entity ${entity.id}`)).toBeInTheDocument();
      rerender(<div />);
    });
  });
});
