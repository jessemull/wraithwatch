import React from 'react';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../Dashboard/Dashboard';

// Mock the child components
jest.mock('../Dashboard/DashboardMetrics', () => ({
  DashboardMetrics: () => <div data-testid="dashboard-metrics">Dashboard Metrics</div>,
}));

jest.mock('../Dashboard/Header', () => ({
  Header: () => <div data-testid="dashboard-header">Dashboard Header</div>,
}));

jest.mock('../Dashboard/ChartCard', () => ({
  ChartCard: () => <div data-testid="chart-card">Chart Card</div>,
}));

jest.mock('../Dashboard/KPICard', () => ({
  KPICard: () => <div data-testid="kpi-card">KPI Card</div>,
}));

jest.mock('../Dashboard/EntityDetails', () => ({
  EntityDetails: () => <div data-testid="entity-details">Entity Details</div>,
}));

jest.mock('../Dashboard/VisualizationControls', () => ({
  VisualizationControls: () => <div data-testid="visualization-controls">Visualization Controls</div>,
}));

jest.mock('../EntitiesList/EntitiesList', () => ({
  EntitiesList: () => <div data-testid="entities-list">Entities List</div>,
}));

jest.mock('../Visualizations', () => ({
  TimelineVisualization: () => <div data-testid="timeline-visualization">Timeline Visualization</div>,
  NetworkVisualization: () => <div data-testid="network-visualization">Network Visualization</div>,
  MatrixVisualization: () => <div data-testid="matrix-visualization">Matrix Visualization</div>,
}));

jest.mock('../ConnectionStatus/ConnectionStatus', () => ({
  ConnectionStatus: () => <div data-testid="connection-status">Connection Status</div>,
}));

describe('Dashboard', () => {
  it('renders dashboard components', async () => {
    render(<Dashboard />);
    
    // Wait for the component to load and render
    await screen.findByTestId('dashboard-header');
    
    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
    // The dashboard metrics might be in loading state, so we check for the header text instead
    expect(screen.getByText('Dashboard Metrics')).toBeInTheDocument();
    expect(screen.getByText('Key Performance Indicators')).toBeInTheDocument();
    expect(screen.getByText('Analytics & Charts')).toBeInTheDocument();
    expect(screen.getByText('Visualization')).toBeInTheDocument();
    expect(screen.getByText('Entity Details')).toBeInTheDocument();
    expect(screen.getByText('Entity List')).toBeInTheDocument();
  });
}); 