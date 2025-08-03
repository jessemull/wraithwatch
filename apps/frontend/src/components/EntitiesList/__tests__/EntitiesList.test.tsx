import React from 'react';
import { render, screen } from '@testing-library/react';
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
});
