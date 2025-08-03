import React from 'react';
import { render, screen } from '@testing-library/react';
import { EntityGroupHeader } from '../EntityGroupHeader';
jest.mock('../../../util/entity', () => ({
  getEntityTypeColor: jest.fn(() => 'bg-blue-500'),
  formatTime: jest.fn(() => '2 hours ago'),
  formatEntityType: jest.fn(() => 'Server'),
}));
describe('EntityGroupHeader', () => {
  const mockProps = {
    type: 'server',
    entities: [{ id: '1', name: 'Server 1' }],
    totalChanges: 5,
    lastSeen: new Date(),
    isExpanded: false,
    onToggle: jest.fn(),
  };
  it('renders entity group header', () => {
    render(<EntityGroupHeader {...mockProps} />);
    expect(screen.getByText('Server')).toBeInTheDocument();
    expect(screen.getByText('1 entity')).toBeInTheDocument();
    expect(screen.getByText('5 changes today')).toBeInTheDocument();
    expect(screen.getByText('Last seen: 2 hours ago')).toBeInTheDocument();
  });
  it('renders with multiple entities', () => {
    const propsWithMultipleEntities = {
      ...mockProps,
      entities: [
        { id: '1', name: 'Server 1' },
        { id: '2', name: 'Server 2' },
      ],
    };
    render(<EntityGroupHeader {...propsWithMultipleEntities} />);
    expect(screen.getByText('2 entities')).toBeInTheDocument();
  });
});
