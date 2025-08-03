import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChartCard } from '../ChartCard';
describe('ChartCard', () => {
  it('renders chart card with title and children', () => {
    render(
      <ChartCard title="Test Chart">
        <div data-testid="chart-content">Chart Content</div>
      </ChartCard>
    );
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
    expect(screen.getByTestId('chart-content')).toBeInTheDocument();
  });
  it('renders with custom className', () => {
    render(
      <ChartCard title="Test Chart" className="custom-class">
        <div>Chart Content</div>
      </ChartCard>
    );
    const cardElement = screen.getByText('Test Chart').closest('div');
    expect(cardElement).toHaveClass('custom-class');
  });
});
