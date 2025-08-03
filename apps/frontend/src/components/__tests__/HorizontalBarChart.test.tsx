import React from 'react';
import { render } from '@testing-library/react';
import { HorizontalBarChart } from '../Charts/HorizontalBarChart';

// Mock the utility function
jest.mock('../../util', () => ({
  capitalizeFirstLetter: jest.fn((str: string) => str.charAt(0).toUpperCase() + str.slice(1)),
}));

describe('HorizontalBarChart', () => {
  const mockData = {
    'server-1': 85,
    'server-2': 92,
    'server-3': 78,
    'server-4': 95,
  };

  it('renders horizontal bar chart with data', () => {
    render(<HorizontalBarChart data={mockData} title="Test Horizontal Chart" />);
    
    // The chart should render without errors
    expect(document.querySelector('[data-testid="bar-chart"]')).toBeInTheDocument();
  });

  it('renders with custom colors', () => {
    render(
      <HorizontalBarChart 
        data={mockData} 
        title="Test Horizontal Chart" 
        backgroundColor="rgba(0, 255, 0, 0.8)"
        borderColor="rgba(0, 255, 0, 1)"
      />
    );
    
    expect(document.querySelector('[data-testid="bar-chart"]')).toBeInTheDocument();
  });

  it('renders with custom bar thickness', () => {
    render(
      <HorizontalBarChart 
        data={mockData} 
        title="Test Horizontal Chart" 
        maxBarThickness={40}
      />
    );
    
    expect(document.querySelector('[data-testid="bar-chart"]')).toBeInTheDocument();
  });

  it('renders with custom border radius', () => {
    render(
      <HorizontalBarChart 
        data={mockData} 
        title="Test Horizontal Chart" 
        borderRadius={5}
      />
    );
    
    expect(document.querySelector('[data-testid="bar-chart"]')).toBeInTheDocument();
  });
}); 