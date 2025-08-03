import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from '../Dashboard/Header';

describe('Header', () => {
  it('renders header with title and user icon', () => {
    render(<Header />);
    
    expect(screen.getByText('Wraithwatch Command Center')).toBeInTheDocument();
    expect(screen.getByAltText('Wraithwatch')).toBeInTheDocument();
  });
}); 