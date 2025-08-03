import React from 'react';
import { render, screen } from '@testing-library/react';
import { KPICard } from '../KPICard';
describe('KPICard', () => {
  it('renders KPI card with title and value', () => {
    render(<KPICard title="Test KPI" value="123" />);
    expect(screen.getByText('Test KPI')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });
  it('renders with positive change', () => {
    render(
      <KPICard
        title="Test KPI"
        value="123"
        change={{ value: '+5%', isPositive: true }}
      />
    );
    expect(screen.getByText('↗')).toBeInTheDocument();
    expect(screen.getByText('+5%')).toBeInTheDocument();
  });
  it('renders with negative change', () => {
    render(
      <KPICard
        title="Test KPI"
        value="123"
        change={{ value: '-3%', isPositive: false }}
      />
    );
    expect(screen.getByText('↘')).toBeInTheDocument();
    expect(screen.getByText('-3%')).toBeInTheDocument();
  });
  it('renders with comparison text', () => {
    render(<KPICard title="Test KPI" value="123" comparison="vs last month" />);
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });
});
