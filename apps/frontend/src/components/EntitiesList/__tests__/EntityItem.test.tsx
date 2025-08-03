import React from 'react';
import { render, screen } from '@testing-library/react';
import { EntityItem } from '../EntityItem';

const mockEntity = {
  id: '1',
  type: 'server',
  status: 'active',
  properties: {},
  lastSeen: new Date().toISOString(),
  changesToday: 5,
};

describe('EntityItem', () => {
  it('renders entity id and type', () => {
    render(<EntityItem entity={mockEntity} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Server')).toBeInTheDocument();
  });
});
