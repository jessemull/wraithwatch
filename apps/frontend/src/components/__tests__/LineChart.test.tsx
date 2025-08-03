import React from 'react';
import { render } from '@testing-library/react';
import { LineChart } from '../Charts/LineChart';

describe('LineChart', () => {
  const mockData = {
    '2024-01': 10,
    '2024-02': 15,
    '2024-03': 12,
    '2024-04': 20,
  };

  it('renders line chart with data', () => {
    render(<LineChart data={mockData} title="Test Line Chart" />);
    
    // The chart should render without errors
    expect(document.querySelector('[data-testid="line-chart"]')).toBeInTheDocument();
  });

  it('renders with custom colors', () => {
    render(
      <LineChart 
        data={mockData} 
        title="Test Line Chart" 
        backgroundColor="rgba(255, 0, 0, 0.2)"
        borderColor="rgba(255, 0, 0, 1)"
      />
    );
    
    expect(document.querySelector('[data-testid="line-chart"]')).toBeInTheDocument();
  });

  it('renders with custom point radius', () => {
    render(
      <LineChart 
        data={mockData} 
        title="Test Line Chart" 
        pointRadius={8}
      />
    );
    
    expect(document.querySelector('[data-testid="line-chart"]')).toBeInTheDocument();
  });
}); 