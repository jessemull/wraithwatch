import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConnectionStatus } from '../ConnectionStatus';

describe('ConnectionStatus', () => {
  it('renders connected status', () => {
    render(<ConnectionStatus isConnected={true} />);

    expect(screen.getByText('WebSocket connection:')).toBeInTheDocument();
    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText('Connected')).toHaveClass('text-green-400');
  });

  it('renders disconnected status', () => {
    render(<ConnectionStatus isConnected={false} />);

    expect(screen.getByText('WebSocket connection:')).toBeInTheDocument();
    expect(screen.getByText('Disconnected')).toBeInTheDocument();
    expect(screen.getByText('Disconnected')).toHaveClass('text-red-400');
  });
});
