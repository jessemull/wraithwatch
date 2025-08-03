import React from 'react';
import { render, screen } from '@testing-library/react';
import { EntityDetails } from '../EntityDetails';
describe('EntityDetails', () => {
  it('renders no entity selected state', () => {
    render(<EntityDetails selectedEntity={undefined} />);
    expect(screen.getByText('No entity selected')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Click on an entity in the visualization to view details'
      )
    ).toBeInTheDocument();
  });
  it('renders entity details', () => {
    const mockEntity = {
      id: 'entity-1',
      type: 'System',
      changesToday: 5,
      lastSeen: new Date('2023-01-01T12:00:00Z').toISOString(),
      properties: {
        cpu_usage: { currentValue: 42 },
        status: { currentValue: 'online' },
      },
    };
    render(<EntityDetails selectedEntity={mockEntity as any} />);
    expect(screen.getByText('entity-1')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
    expect(screen.getByText('Changes Today')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Last Seen')).toBeInTheDocument();
    expect(screen.getByText('Cpu Usage')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('ONLINE')).toBeInTheDocument();
  });
  it('renders with entity that has source_ip property', () => {
    const mockEntity = {
      id: 'entity-1',
      type: 'System',
      changesToday: 5,
      lastSeen: new Date('2023-01-01T12:00:00Z').toISOString(),
      properties: {
        cpu_usage: { currentValue: 42 },
        status: { currentValue: 'online' },
      },
    };
    const entityWithSourceIp = {
      ...mockEntity,
      properties: {
        ...mockEntity.properties,
        source_ip: {
          currentValue: '192.168.1.100',
          lastChanged: '2023-01-01T12:00:00Z',
          history: [],
        },
      },
    };

    render(<EntityDetails selectedEntity={entityWithSourceIp} />);

    expect(screen.getByText('Source IP')).toBeInTheDocument();
    expect(screen.getByText('192.168.1.100')).toBeInTheDocument();
  });

  it('renders with entity that has source_ip property but no currentValue', () => {
    const mockEntity = {
      id: 'entity-1',
      type: 'System',
      changesToday: 5,
      lastSeen: new Date('2023-01-01T12:00:00Z').toISOString(),
      properties: {
        cpu_usage: { currentValue: 42 },
        status: { currentValue: 'online' },
      },
    };
    const entityWithEmptySourceIp = {
      ...mockEntity,
      properties: {
        ...mockEntity.properties,
        source_ip: {
          currentValue: '',
          lastChanged: '2023-01-01T12:00:00Z',
          history: [],
        },
      },
    };

    render(<EntityDetails selectedEntity={entityWithEmptySourceIp} />);

    expect(screen.queryByText('Source IP')).not.toBeInTheDocument();
  });

  it('renders with entity that has source_ip property with null currentValue', () => {
    const mockEntity = {
      id: 'entity-1',
      type: 'System',
      changesToday: 5,
      lastSeen: new Date('2023-01-01T12:00:00Z').toISOString(),
      properties: {
        cpu_usage: { currentValue: 42 },
        status: { currentValue: 'online' },
      },
    };
    const entityWithNullSourceIp = {
      ...mockEntity,
      properties: {
        ...mockEntity.properties,
        source_ip: {
          currentValue: null as any,
          lastChanged: '2023-01-01T12:00:00Z',
          history: [],
        },
      },
    };

    render(<EntityDetails selectedEntity={entityWithNullSourceIp} />);

    expect(screen.queryByText('Source IP')).not.toBeInTheDocument();
  });

  it('renders with entity that has source_ip property with undefined currentValue', () => {
    const mockEntity = {
      id: 'entity-1',
      type: 'System',
      changesToday: 5,
      lastSeen: new Date('2023-01-01T12:00:00Z').toISOString(),
      properties: {
        cpu_usage: { currentValue: 42 },
        status: { currentValue: 'online' },
      },
    };
    const entityWithUndefinedSourceIp = {
      ...mockEntity,
      properties: {
        ...mockEntity.properties,
        source_ip: {
          currentValue: undefined as any,
          lastChanged: '2023-01-01T12:00:00Z',
          history: [],
        },
      },
    };

    render(<EntityDetails selectedEntity={entityWithUndefinedSourceIp} />);

    expect(screen.queryByText('Source IP')).not.toBeInTheDocument();
  });

  it('renders with entity that has properties with non-string/number values', () => {
    const mockEntity = {
      id: 'entity-1',
      type: 'System',
      changesToday: 5,
      lastSeen: new Date('2023-01-01T12:00:00Z').toISOString(),
      properties: {
        cpu_usage: { currentValue: 42 },
        status: { currentValue: 'online' },
      },
    };
    const entityWithComplexProperties = {
      ...mockEntity,
      properties: {
        ...mockEntity.properties,
        complex_prop: {
          currentValue: { nested: 'object' },
          lastChanged: '2023-01-01T12:00:00Z',
          history: [],
        },
        array_prop: {
          currentValue: [1, 2, 3],
          lastChanged: '2023-01-01T12:00:00Z',
          history: [],
        },
        boolean_prop: {
          currentValue: true,
          lastChanged: '2023-01-01T12:00:00Z',
          history: [],
        },
      },
    };

    render(<EntityDetails selectedEntity={entityWithComplexProperties} />);

    expect(screen.getByText('Complex Prop')).toBeInTheDocument();
    expect(screen.getByText('[object Object]')).toBeInTheDocument();
    expect(screen.getByText('Array Prop')).toBeInTheDocument();
    expect(screen.getByText('1,2,3')).toBeInTheDocument();
    expect(screen.getByText('Boolean Prop')).toBeInTheDocument();
    expect(screen.getByText('true')).toBeInTheDocument();
  });

  it('renders with entity that has properties with null values', () => {
    const mockEntity = {
      id: 'entity-1',
      type: 'System',
      changesToday: 5,
      lastSeen: new Date('2023-01-01T12:00:00Z').toISOString(),
      properties: {
        cpu_usage: { currentValue: 42 },
        status: { currentValue: 'online' },
      },
    };
    const entityWithNullProperties = {
      ...mockEntity,
      properties: {
        ...mockEntity.properties,
        null_prop: {
          currentValue: null as any,
          lastChanged: '2023-01-01T12:00:00Z',
          history: [],
        },
        undefined_prop: {
          currentValue: undefined as any,
          lastChanged: '2023-01-01T12:00:00Z',
          history: [],
        },
      },
    };

    render(<EntityDetails selectedEntity={entityWithNullProperties} />);

    expect(screen.getByText('Null Prop')).toBeInTheDocument();
    expect(screen.getByText('null')).toBeInTheDocument();
    expect(screen.getByText('Undefined Prop')).toBeInTheDocument();
    expect(screen.getByText('undefined')).toBeInTheDocument();
  });
});
