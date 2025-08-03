import React from 'react';
import { render } from '@testing-library/react';
import { DoughnutChart } from '../Charts/DoughnutChart';

// Mock the constants
jest.mock('../../constants/charts', () => ({
  DEFAULT_COLORS: [
    'rgba(59, 130, 246, 0.5)',
    'rgba(34, 197, 94, 0.5)',
    'rgba(251, 191, 36, 0.5)',
    'rgba(168, 85, 247, 0.5)',
    'rgba(239, 68, 68, 0.5)',
    'rgba(14, 165, 233, 0.5)',
  ],
  DEFAULT_BORDER_COLORS: [
    'rgba(59, 130, 246, 1)',
    'rgba(34, 197, 94, 1)',
    'rgba(251, 191, 36, 1)',
    'rgba(168, 85, 247, 1)',
    'rgba(239, 68, 68, 1)',
    'rgba(14, 165, 233, 1)',
  ],
}));

describe('DoughnutChart', () => {
  const mockData = {
    servers: 25,
    databases: 15,
    networks: 10,
    applications: 20,
  };

  it('renders doughnut chart with data', () => {
    render(<DoughnutChart data={mockData} />);
    
    // The chart should render without errors
    expect(document.querySelector('[data-testid="doughnut-chart"]')).toBeInTheDocument();
  });

  it('renders with custom colors', () => {
    const customColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
    render(<DoughnutChart data={mockData} colors={customColors} />);
    
    expect(document.querySelector('[data-testid="doughnut-chart"]')).toBeInTheDocument();
  });

  it('renders with custom border width', () => {
    render(<DoughnutChart data={mockData} borderWidth={3} />);
    
    expect(document.querySelector('[data-testid="doughnut-chart"]')).toBeInTheDocument();
  });

  it('renders without legend', () => {
    render(<DoughnutChart data={mockData} showLegend={false} />);
    
    expect(document.querySelector('[data-testid="doughnut-chart"]')).toBeInTheDocument();
  });

  it('renders with custom legend position', () => {
    render(<DoughnutChart data={mockData} legendPosition="right" />);
    
    expect(document.querySelector('[data-testid="doughnut-chart"]')).toBeInTheDocument();
  });
}); 