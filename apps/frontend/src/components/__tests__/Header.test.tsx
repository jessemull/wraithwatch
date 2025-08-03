import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from '../Dashboard/Header';

describe('Header', () => {
  it('renders header component', () => {
    render(<Header />);
    
    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
  });
}); 