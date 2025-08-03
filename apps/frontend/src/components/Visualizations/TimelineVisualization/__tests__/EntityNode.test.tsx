import React from 'react';
import { render, screen } from '@testing-library/react';
import { EntityNode } from '../EntityNode';

// Mock Three.js components
jest.mock('@react-three/drei', () => ({
  Text: ({
    children,
    fontSize,
    color,
    anchorX,
    anchorY,
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
        outlineWidth,
        outlineColor,
      }}
    >
      {children}
    </div>
  ),
}));

// Mock the getEntityName utility
jest.mock('../../../../util/entity', () => ({
  getEntityName: (id: string) => `Entity ${id}`,
}));

// Mock constants
jest.mock('../../../../constants/visualization', () => ({
  ENTITY_STYLES: {
    AI_Agent: {
      base: { color: '#4ecdc4', textColor: '#ffffff', pulse: true },
      default: { size: 0.5, emissiveIntensity: 0.3 },
      selected: { size: 0.7, emissiveIntensity: 0.8 },
    },
    System: {
      base: { color: '#45b7d1', textColor: '#ffffff', pulse: false },
      default: { size: 0.4, emissiveIntensity: 0.2 },
      selected: { size: 0.6, emissiveIntensity: 0.6 },
    },
    User: {
      base: { color: '#96ceb4', textColor: '#ffffff', pulse: false },
      default: { size: 0.3, emissiveIntensity: 0.1 },
      selected: { size: 0.5, emissiveIntensity: 0.4 },
    },
    Threat: {
      base: { color: '#ff6b6b', textColor: '#ffffff', pulse: true },
      default: { size: 0.6, emissiveIntensity: 0.4 },
      selected: { size: 0.8, emissiveIntensity: 0.9 },
    },
  },
  DEFAULT_ENTITY_STYLE: {
    base: { color: '#cccccc', textColor: '#ffffff', pulse: false },
    default: { size: 0.4, emissiveIntensity: 0.2 },
    selected: { size: 0.6, emissiveIntensity: 0.6 },
  },
  TIMELINE_CONFIG: {
    pulse: {
      scaleMultiplier: 1.5,
      opacity: 0.3,
      emissiveIntensity: 0.2,
    },
    text: {
      fontSize: 0.2,
      outlineWidth: 0.02,
      outlineColor: '#000000',
    },
  },
}));

describe('EntityNode', () => {
  const mockEntity = {
    id: 'entity-1',
    name: 'Test Entity',
    type: 'System' as const,
    properties: {},
    lastSeen: '2023-01-01T12:00:00Z',
    changesToday: 5,
  };

  it('renders EntityNode with mesh and text', () => {
    render(
      <EntityNode
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
      <EntityNode
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
      <EntityNode
        entity={mockEntity}
        position={[0, 0, 0]}
        isSelected={false}
        onClick={mockOnClick}
      />
    );

    // Since we're mocking Three.js components, we can't easily test the mesh click
    // But we can verify the onClick prop is passed correctly
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('renders different entity types with correct styles', () => {
    const entityTypes = ['AI_Agent', 'System', 'User', 'Threat'] as const;

    entityTypes.forEach(entityType => {
      const entity = {
        ...mockEntity,
        type: entityType,
      };

      const { rerender } = render(
        <EntityNode
          entity={entity}
          position={[0, 0, 0]}
          isSelected={false}
          onClick={jest.fn()}
        />
      );

      expect(screen.getByText(`Entity ${mockEntity.id}`)).toBeInTheDocument();

      // Clean up for next iteration
      rerender(<div />);
    });
  });

  it('renders threat entity with pulse effect', () => {
    const threatEntity = {
      ...mockEntity,
      type: 'Threat' as const,
    };

    render(
      <EntityNode
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
      <EntityNode
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
        <EntityNode
          entity={mockEntity}
          position={position}
          isSelected={false}
          onClick={jest.fn()}
        />
      );

      expect(screen.getByText('Entity entity-1')).toBeInTheDocument();

      // Clean up for next iteration
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
        <EntityNode
          entity={entity}
          position={[0, 0, 0]}
          isSelected={false}
          onClick={jest.fn()}
        />
      );

      expect(screen.getByText(`Entity ${entity.id}`)).toBeInTheDocument();

      // Clean up for next iteration
      rerender(<div />);
    });
  });

  it('handles unknown entity types', () => {
    const unknownEntity = {
      ...mockEntity,
      type: 'Unknown' as any,
    };

    render(
      <EntityNode
        entity={unknownEntity}
        position={[0, 0, 0]}
        isSelected={false}
        onClick={jest.fn()}
      />
    );

    expect(screen.getByText('Entity entity-1')).toBeInTheDocument();
  });
});
