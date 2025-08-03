import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Dashboard } from '../Dashboard';
jest.mock('../../../hooks/useRealTimeData', () => ({
  useRealTimeData: () => ({
    entities: [],
    changes: [],
    positions: {},
    metrics: {},
    loading: false,
    error: null,
  }),
}));
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (importFn: any, options: any) => {
    const Component = () => {
      if (options?.loading) {
        return options.loading();
      }
      return <div data-testid="dynamic-component">Dynamic Component</div>;
    };
    Component.displayName = 'DynamicComponent';
    return Component;
  },
}));
jest.mock('../Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));
jest.mock('../DashboardMetrics', () => ({
  DashboardMetrics: () => (
    <div data-testid="dashboard-metrics">Dashboard Metrics</div>
  ),
}));
jest.mock('../EntityDetails', () => ({
  EntityDetails: ({ selectedEntity }: any) => (
    <div data-testid="entity-details">
      Entity Details {selectedEntity ? '(selected)' : '(none)'}
    </div>
  ),
}));
jest.mock('../VisualizationControls', () => ({
  VisualizationControls: ({ visualizationType }: any) => (
    <div data-testid="visualization-controls">
      Controls: {visualizationType}
    </div>
  ),
}));
jest.mock('../../EntitiesList', () => ({
  EntitiesList: () => <div data-testid="entities-list">Entities List</div>,
}));
describe('Dashboard', () => {
  it('renders dashboard with all sections', async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    expect(screen.getByText('Visualization')).toBeInTheDocument();
    expect(screen.getByText('Entity List')).toBeInTheDocument();
    expect(
      screen.getByText('Real-Time Mode - Entities Updating Dynamically')
    ).toBeInTheDocument();
  });
  it('renders header component', async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });
  it('renders dashboard metrics component', async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    expect(screen.getByTestId('dashboard-metrics')).toBeInTheDocument();
  });
  it('renders entity details component', async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    expect(screen.getByTestId('entity-details')).toBeInTheDocument();
  });
  it('renders entities list component', async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    expect(screen.getByTestId('entities-list')).toBeInTheDocument();
  });
  it('renders visualization controls', async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    expect(screen.getByTestId('visualization-controls')).toBeInTheDocument();
  });
});
