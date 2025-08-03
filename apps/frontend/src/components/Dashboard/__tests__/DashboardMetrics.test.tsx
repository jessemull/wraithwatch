import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { DashboardMetrics } from '../DashboardMetrics';

describe('DashboardMetrics', () => {
  it('renders KPI cards with default metrics', async () => {
    await act(async () => {
      render(<DashboardMetrics entities={[]} />);
    });

    expect(screen.getByText('Key Performance Indicators')).toBeInTheDocument();
    expect(screen.getByText('Active Threats')).toBeInTheDocument();
    expect(screen.getByText('Threat Score')).toBeInTheDocument();
    expect(screen.getByText('AI Confidence')).toBeInTheDocument();
    expect(screen.getByText('Total Connections')).toBeInTheDocument();
  });

  it('renders analytics charts section', async () => {
    await act(async () => {
      render(<DashboardMetrics entities={[]} />);
    });

    expect(screen.getByText('Analytics & Charts')).toBeInTheDocument();
    expect(
      screen.getByText('Threat Severity Distribution')
    ).toBeInTheDocument();
    expect(screen.getByText('Network Status Distribution')).toBeInTheDocument();
    expect(screen.getByText('Entity Changes')).toBeInTheDocument();
    expect(screen.getByText('AI Agent Activity')).toBeInTheDocument();
  });

  it('renders with custom metrics', async () => {
    const customMetrics = {
      activeThreats: 5,
      threatScore: '0.75',
      aiConfidence: 85,
      totalConnections: 150,
      threatSeverityDistribution: {},
      aiAgentActivity: {},
      protocolUsage: {},
      entityChangesByDay: {},
    };

    await act(async () => {
      render(<DashboardMetrics entities={[]} metrics={customMetrics} />);
    });

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('0.75')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });
});
