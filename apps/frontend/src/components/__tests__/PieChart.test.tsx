import React from 'react';
import { render } from '@testing-library/react';
import { PieChart } from '../Charts/PieChart';

// Mock the constants
jest.mock('../../constants/charts', () => ({
  PIE_CHART_COLORS: [
    'rgba(59, 130, 246, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)',
  ],
}));

describe('PieChart', () => {
  const mockData = {
    active: 15,
    inactive: 5,
    pending: 3,
  };

  it('renders pie chart with data', () => {
    render(<PieChart data={mockData} />);
    
    // The chart should render without errors
    expect(document.querySelector('[data-testid="pie-chart"]')).toBeInTheDocument();
  });

  it('renders with custom colors', () => {
    const customColors = ['#ff0000', '#00ff00', '#0000ff'];
    render(<PieChart data={mockData} colors={customColors} />);
    
    expect(document.querySelector('[data-testid="pie-chart"]')).toBeInTheDocument();
  });

  it('renders with custom border width', () => {
    render(<PieChart data={mockData} borderWidth={3} />);
    
    expect(document.querySelector('[data-testid="pie-chart"]')).toBeInTheDocument();
  });

  it('renders without legend', () => {
    render(<PieChart data={mockData} showLegend={false} />);
    
    expect(document.querySelector('[data-testid="pie-chart"]')).toBeInTheDocument();
  });

  it('renders with custom legend position', () => {
    render(<PieChart data={mockData} legendPosition="top" />);
    
    expect(document.querySelector('[data-testid="pie-chart"]')).toBeInTheDocument();
  });
}); 