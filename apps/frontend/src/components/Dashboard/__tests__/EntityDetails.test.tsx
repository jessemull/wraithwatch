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

  it('renders source_ip property if present', () => {
    const mockEntity = {
      id: 'entity-2',
      type: 'System',
      changesToday: 1,
      lastSeen: new Date().toISOString(),
      properties: {
        source_ip: { currentValue: '192.168.1.1' },
      },
    };
    render(<EntityDetails selectedEntity={mockEntity as any} />);
    expect(screen.getByText('Source IP')).toBeInTheDocument();
    expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
  });
});
