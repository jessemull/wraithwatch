import React from 'react';
import { render } from '@testing-library/react';
import { TimeScale } from '../Visualizations/TimelineVisualization/TimeScale';

// Mock @react-three/drei
jest.mock('@react-three/drei', () => ({
  Text: ({ children, position }: { children: React.ReactNode; position: [number, number, number] }) => (
    <div data-testid="text" data-position={position.join(',')}>
      {children}
    </div>
  ),
}));

describe('TimeScale', () => {
  it('renders time scale with formatted times', () => {
    render(<TimeScale position={[0, 0, 0]} />);
    
    // The component should render 3 Text elements with time information
    const textElements = document.querySelectorAll('[data-testid="text"]');
    expect(textElements).toHaveLength(3);
  });

  it('renders with correct position', () => {
    render(<TimeScale position={[10, 20, 30]} />);
    
    const textElements = document.querySelectorAll('[data-testid="text"]');
    expect(textElements[0]).toHaveAttribute('data-position', '-6,8,0');
    expect(textElements[1]).toHaveAttribute('data-position', '-6,-8,0');
    expect(textElements[2]).toHaveAttribute('data-position', '0,0,0');
  });
}); 