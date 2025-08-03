import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConnectionStatus } from '../ConnectionStatus/ConnectionStatus';

describe('ConnectionStatus', () => {
  it('renders connection status component', () => {
    render(<ConnectionStatus />);
    
    expect(screen.getByTestId('connection-status')).toBeInTheDocument();
  });
}); 