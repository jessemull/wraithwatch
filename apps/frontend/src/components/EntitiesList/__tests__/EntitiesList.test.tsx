import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EntitiesList } from '../EntitiesList';
const mockEntities = [
  {
    id: '1',
    type: 'server',
    status: 'active',
    properties: {},
    lastSeen: new Date().toISOString(),
    changesToday: 5,
  },
];
describe('EntitiesList', () => {
  it('renders without crashing', () => {
    render(<EntitiesList entities={mockEntities} />);
    expect(screen.getByText('Entities')).toBeInTheDocument();
    expect(screen.getByText('1 Total Entities')).toBeInTheDocument();
  });

  it('handles entities with invalid last seen dates', () => {
    const entitiesWithInvalidDates = [
      {
        id: 'entity-1',
        name: 'Entity with Invalid Date',
        type: 'System',
        changesToday: 5,
        lastSeen: 'invalid-date',
        properties: {},
      },
      {
        id: 'entity-2',
        name: 'Entity with Valid Date',
        type: 'System',
        changesToday: 3,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={entitiesWithInvalidDates} />);

    expect(screen.getByText('2 Total Entities')).toBeInTheDocument();
  });

  it('handles entities with null last seen dates', () => {
    const entitiesWithNullDates = [
      {
        id: 'entity-1',
        name: 'Entity with Null Date',
        type: 'System',
        changesToday: 5,
        lastSeen: null as any,
        properties: {},
      },
      {
        id: 'entity-2',
        name: 'Entity with Valid Date',
        type: 'System',
        changesToday: 3,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={entitiesWithNullDates} />);

    expect(screen.getByText('2 Total Entities')).toBeInTheDocument();
  });

  it('handles entities with undefined last seen dates', () => {
    const entitiesWithUndefinedDates = [
      {
        id: 'entity-1',
        name: 'Entity with Undefined Date',
        type: 'System',
        changesToday: 5,
        lastSeen: undefined as any,
        properties: {},
      },
      {
        id: 'entity-2',
        name: 'Entity with Valid Date',
        type: 'System',
        changesToday: 3,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={entitiesWithUndefinedDates} />);

    expect(screen.getByText('2 Total Entities')).toBeInTheDocument();
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
      {
        id: 'entity-2',
        name: 'Entity with Positive Changes',
        type: 'System',
        changesToday: 3,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={entitiesWithNegativeChanges} />);

    expect(screen.getByText('2 Total Entities')).toBeInTheDocument();
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
      {
        id: 'entity-2',
        name: 'Entity with Normal Changes',
        type: 'System',
        changesToday: 3,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={entitiesWithLargeChanges} />);

    expect(screen.getByText('2 Total Entities')).toBeInTheDocument();
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
      {
        id: 'entity-2',
        name: 'Entity with Changes',
        type: 'System',
        changesToday: 3,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={entitiesWithZeroChanges} />);

    expect(screen.getByText('2 Total Entities')).toBeInTheDocument();
  });

  it('handles entities with complex properties', () => {
    const entitiesWithComplexProps = [
      {
        id: 'entity-1',
        name: 'Entity with Complex Properties',
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
        },
      },
    ];

    render(<EntitiesList entities={entitiesWithComplexProps} />);

    expect(screen.getByText('1 Total Entities')).toBeInTheDocument();
  });

  it('handles entities with null properties', () => {
    const entitiesWithNullProps = [
      {
        id: 'entity-1',
        name: 'Entity with Null Properties',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: null,
      },
    ];

    render(<EntitiesList entities={entitiesWithNullProps} />);

    expect(screen.getByText('1 Total Entities')).toBeInTheDocument();
  });

  it('handles entities with undefined properties', () => {
    const entitiesWithUndefinedProps = [
      {
        id: 'entity-1',
        name: 'Entity with Undefined Properties',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: undefined,
      },
    ];

    render(<EntitiesList entities={entitiesWithUndefinedProps} />);

    expect(screen.getByText('1 Total Entities')).toBeInTheDocument();
  });

  it('handles large number of entities', () => {
    const largeEntities = Array.from({ length: 100 }, (_, i) => ({
      id: `entity-${i}`,
      name: `Entity ${i}`,
      type: 'System',
      changesToday: i,
      lastSeen: new Date().toISOString(),
      properties: {},
    }));

    render(<EntitiesList entities={largeEntities} />);

    expect(screen.getByText('100 Total Entities')).toBeInTheDocument();
  });

  it('handles entities with different types', () => {
    const entitiesWithDifferentTypes = [
      {
        id: 'entity-1',
        name: 'System Entity',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
      {
        id: 'entity-2',
        name: 'User Entity',
        type: 'User',
        changesToday: 3,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
      {
        id: 'entity-3',
        name: 'Sensor Entity',
        type: 'Sensor',
        changesToday: 7,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={entitiesWithDifferentTypes} />);

    expect(screen.getByText('3 Total Entities')).toBeInTheDocument();
  });

  it('handles entities with empty type', () => {
    const entitiesWithEmptyType = [
      {
        id: 'entity-1',
        name: 'Entity with Empty Type',
        type: '',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={entitiesWithEmptyType} />);

    expect(screen.getByText('1 Total Entities')).toBeInTheDocument();
  });

  it('handles entities with null type', () => {
    const entitiesWithNullType = [
      {
        id: 'entity-1',
        name: 'Entity with Null Type',
        type: null as any,
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={entitiesWithNullType} />);

    expect(screen.getByText('1 Total Entities')).toBeInTheDocument();
  });

  it('handles entities with undefined type', () => {
    const entitiesWithUndefinedType = [
      {
        id: 'entity-1',
        name: 'Entity with Undefined Type',
        type: undefined as any,
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={entitiesWithUndefinedType} />);

    expect(screen.getByText('1 Total Entities')).toBeInTheDocument();
  });

  it('handles useMemo dependencies correctly', () => {
    const mockEntities = [
      {
        id: 'entity-1',
        name: 'Test Entity',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    const { rerender } = render(<EntitiesList entities={mockEntities} />);

    // Re-render with same entities to test useMemo
    rerender(<EntitiesList entities={mockEntities} />);

    expect(screen.getByText('1 Total Entities')).toBeInTheDocument();
  });

  it('handles useCallback dependencies correctly', () => {
    const mockEntities = [
      {
        id: 'entity-1',
        name: 'Test Entity',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={mockEntities} />);

    // Test that toggleType callback works correctly
    const systemHeader = screen.getByText('System');
    fireEvent.click(systemHeader);

    expect(screen.getByText('1 Total Entities')).toBeInTheDocument();
  });

  it('handles aggregation logic with mixed data', () => {
    const mixedEntities = [
      {
        id: 'entity-1',
        name: 'System Entity 1',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date('2023-01-01T12:00:00Z').toISOString(),
        properties: {},
      },
      {
        id: 'entity-2',
        name: 'System Entity 2',
        type: 'System',
        changesToday: 3,
        lastSeen: new Date('2023-01-02T12:00:00Z').toISOString(),
        properties: {},
      },
      {
        id: 'entity-3',
        name: 'User Entity',
        type: 'User',
        changesToday: 7,
        lastSeen: new Date('2023-01-03T12:00:00Z').toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={mixedEntities} />);

    expect(screen.getByText('3 Total Entities')).toBeInTheDocument();
  });

  it('handles aggregation with same last seen dates', () => {
    const sameDate = new Date('2023-01-01T12:00:00Z').toISOString();
    const entitiesWithSameDate = [
      {
        id: 'entity-1',
        name: 'System Entity 1',
        type: 'System',
        changesToday: 5,
        lastSeen: sameDate,
        properties: {},
      },
      {
        id: 'entity-2',
        name: 'System Entity 2',
        type: 'System',
        changesToday: 3,
        lastSeen: sameDate,
        properties: {},
      },
    ];

    render(<EntitiesList entities={entitiesWithSameDate} />);

    expect(screen.getByText('2 Total Entities')).toBeInTheDocument();
  });

  it('handles aggregation with empty entities array', () => {
    render(<EntitiesList entities={[]} />);

    expect(screen.getByText('0 Total Entities')).toBeInTheDocument();
  });

  it('handles aggregation with single entity', () => {
    const singleEntity = [
      {
        id: 'entity-1',
        name: 'Single Entity',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={singleEntity} />);

    expect(screen.getByText('1 Total Entities')).toBeInTheDocument();
  });

  it('handles last update formatting', () => {
    const mockEntities = [
      {
        id: 'entity-1',
        name: 'Test Entity',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    const lastUpdate = new Date().toISOString();
    render(<EntitiesList entities={mockEntities} lastUpdate={lastUpdate} />);

    expect(screen.getByText(/Last Update:/)).toBeInTheDocument();
  });

  it('handles last update with invalid date', () => {
    const mockEntities = [
      {
        id: 'entity-1',
        name: 'Test Entity',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={mockEntities} lastUpdate="invalid-date" />);

    expect(screen.getByText(/Last Update:/)).toBeInTheDocument();
  });

  it('handles last update with null value', () => {
    const mockEntities = [
      {
        id: 'entity-1',
        name: 'Test Entity',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={mockEntities} lastUpdate={null as any} />);

    expect(screen.getByText('1 Total Entities')).toBeInTheDocument();
    expect(screen.queryByText(/Last Update:/)).not.toBeInTheDocument();
  });

  it('handles last update with undefined value', () => {
    const mockEntities = [
      {
        id: 'entity-1',
        name: 'Test Entity',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={mockEntities} lastUpdate={undefined} />);

    expect(screen.getByText('1 Total Entities')).toBeInTheDocument();
    expect(screen.queryByText(/Last Update:/)).not.toBeInTheDocument();
  });

  it('handles CSS classes correctly', () => {
    const mockEntities = [
      {
        id: 'entity-1',
        name: 'Test Entity',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={mockEntities} />);

    // Check that container has correct classes
    const container = screen
      .getByText('1 Total Entities')
      .closest('.bg-gray-900\\/50');
    expect(container).toBeInTheDocument();
  });

  it('handles backdrop blur effects', () => {
    const mockEntities = [
      {
        id: 'entity-1',
        name: 'Test Entity',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={mockEntities} />);

    // Check that backdrop blur classes are applied
    const backdropElements = document.querySelectorAll('.backdrop-blur-sm');
    expect(backdropElements.length).toBeGreaterThan(0);
  });

  it('handles border styling', () => {
    const mockEntities = [
      {
        id: 'entity-1',
        name: 'Test Entity',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={mockEntities} />);

    // Check that border classes are applied
    const borderElements = document.querySelectorAll('.border.border-gray-800');
    expect(borderElements.length).toBeGreaterThan(0);
  });

  it('handles shadow effects', () => {
    const mockEntities = [
      {
        id: 'entity-1',
        name: 'Test Entity',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={mockEntities} />);

    // Check that shadow classes are applied
    const shadowElements = document.querySelectorAll('.shadow-2xl');
    expect(shadowElements.length).toBeGreaterThan(0);
  });

  it('handles flex layout', () => {
    const mockEntities = [
      {
        id: 'entity-1',
        name: 'Test Entity',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={mockEntities} />);

    // Check that flex classes are applied
    const flexElements = document.querySelectorAll('.flex.flex-col');
    expect(flexElements.length).toBeGreaterThan(0);
  });

  it('handles overflow handling', () => {
    const mockEntities = [
      {
        id: 'entity-1',
        name: 'Test Entity',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {},
      },
    ];

    render(<EntitiesList entities={mockEntities} />);

    // Check that overflow classes are applied
    const overflowElements = document.querySelectorAll('.overflow-y-auto');
    expect(overflowElements.length).toBeGreaterThan(0);
  });
});
