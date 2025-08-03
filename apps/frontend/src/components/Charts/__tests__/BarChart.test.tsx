import React from 'react';
import { render } from '@testing-library/react';
import { BarChart } from '../BarChart';

// Mock the utility function
jest.mock('../../../util', () => ({
  capitalizeFirstLetter: jest.fn(
    (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
  ),
}));

describe('BarChart', () => {
  const mockData = {
    low: 5,
    medium: 10,
    high: 3,
  };

  it('renders bar chart with data', () => {
    render(<BarChart data={mockData} title="Test Chart" />);

    // The chart should render without errors
    expect(
      document.querySelector('[data-testid="bar-chart"]')
    ).toBeInTheDocument();
  });

  it('renders with custom colors', () => {
    render(
      <BarChart
        data={mockData}
        title="Test Chart"
        backgroundColor="rgba(255, 0, 0, 0.8)"
        borderColor="rgba(255, 0, 0, 1)"
      />
    );

    expect(
      document.querySelector('[data-testid="bar-chart"]')
    ).toBeInTheDocument();
  });

  it('renders with custom bar thickness', () => {
    render(
      <BarChart data={mockData} title="Test Chart" maxBarThickness={50} />
    );

    expect(
      document.querySelector('[data-testid="bar-chart"]')
    ).toBeInTheDocument();
  });
});
