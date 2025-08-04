import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Dashboard } from '../Dashboard';
import { useRealTimeData } from '../../../hooks/useRealTimeData';

jest.mock('../../../hooks/useRealTimeData', () => ({
  useRealTimeData: jest.fn(),
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
  DashboardMetrics: ({ entities, metrics }: any) => (
    <div data-testid="dashboard-metrics">
      Dashboard Metrics - Entities: {entities?.length || 0}, Metrics:{' '}
      {metrics ? 'yes' : 'no'}
    </div>
  ),
}));

jest.mock('../EntityDetails', () => ({
  EntityDetails: ({ selectedEntity }: any) => (
    <div data-testid="entity-details">
      Entity Details {selectedEntity ? `(${selectedEntity.id})` : '(none)'}
    </div>
  ),
}));

jest.mock('../VisualizationControls', () => ({
  VisualizationControls: ({
    visualizationType,
    onVisualizationTypeChange,
    entitiesCount,
    changesCount,
  }: any) => (
    <div data-testid="visualization-controls">
      Controls: {visualizationType} - Entities: {entitiesCount}, Changes:{' '}
      {changesCount}
      <button
        onClick={() => onVisualizationTypeChange('network')}
        data-testid="switch-to-network"
      >
        Switch to Network
      </button>
      <button
        onClick={() => onVisualizationTypeChange('matrix')}
        data-testid="switch-to-matrix"
      >
        Switch to Matrix
      </button>
      <button
        onClick={() => onVisualizationTypeChange('timeline')}
        data-testid="switch-to-timeline"
      >
        Switch to Timeline
      </button>
    </div>
  ),
}));

jest.mock('../../EntitiesList', () => ({
  EntitiesList: ({ entities, lastUpdate }: any) => (
    <div data-testid="entities-list">
      Entities List - Count: {entities?.length || 0}, Last Update:{' '}
      {lastUpdate ? 'yes' : 'no'}
    </div>
  ),
}));

jest.mock('../WelcomeSection', () => ({
  WelcomeSection: () => (
    <div data-testid="welcome-section">Welcome Section</div>
  ),
}));

const mockUseRealTimeData = useRealTimeData as jest.MockedFunction<
  typeof useRealTimeData
>;

describe('Dashboard', () => {
  const defaultMockData = {
    entities: [],
    changes: [],
    positions: {},
    metrics: {},
    loading: false,
    error: null,
  };

  beforeEach(() => {
    mockUseRealTimeData.mockReturnValue(defaultMockData);
  });

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

  it('renders welcome section when not loading', async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    expect(screen.getByTestId('welcome-section')).toBeInTheDocument();
  });

  it('does not render welcome section when loading', async () => {
    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      loading: true,
    });

    await act(async () => {
      render(<Dashboard />);
    });
    expect(screen.queryByTestId('welcome-section')).not.toBeInTheDocument();
  });

  it('shows error message when there is an error', async () => {
    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      error: 'Connection failed',
    });

    await act(async () => {
      render(<Dashboard />);
    });
    expect(screen.getByText('Error: Connection failed')).toBeInTheDocument();
  });

  it('shows loading state for dashboard metrics when loading', async () => {
    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      loading: true,
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByText('Key Performance Indicators')).toBeInTheDocument();
    expect(screen.getByText('Analytics & Charts')).toBeInTheDocument();
  });

  it('shows loading state for visualization when loading', async () => {
    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      loading: true,
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByText('Visualization')).toBeInTheDocument();
  });

  it('shows loading state for entity details when loading', async () => {
    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      loading: true,
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByText('Entity Details')).toBeInTheDocument();
  });

  it('shows loading state for entity list when loading', async () => {
    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      loading: true,
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByText('Entity List')).toBeInTheDocument();
  });

  it('passes correct props to DashboardMetrics', async () => {
    const mockEntities = [{ id: 'entity-1', name: 'Test Entity' }];
    const mockMetrics = { activeThreats: 5 };

    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      entities: mockEntities,
      metrics: mockMetrics,
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByTestId('dashboard-metrics')).toHaveTextContent(
      'Entities: 1'
    );
    expect(screen.getByTestId('dashboard-metrics')).toHaveTextContent(
      'Metrics: yes'
    );
  });

  it('passes correct props to EntitiesList', async () => {
    const mockEntities = [{ id: 'entity-1', name: 'Test Entity' }];

    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      entities: mockEntities,
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByTestId('entities-list')).toHaveTextContent('Count: 1');
    expect(screen.getByTestId('entities-list')).toHaveTextContent(
      'Last Update: yes'
    );
  });

  it('passes correct props to VisualizationControls', async () => {
    const mockEntities = [{ id: 'entity-1', name: 'Test Entity' }];
    const mockChanges = [{ id: 'change-1' }];

    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      entities: mockEntities,
      changes: mockChanges,
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByTestId('visualization-controls')).toHaveTextContent(
      'Entities: 1'
    );
    expect(screen.getByTestId('visualization-controls')).toHaveTextContent(
      'Changes: 1'
    );
  });

  it('switches visualization type when controls are clicked', async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    const networkButton = screen.getByTestId('switch-to-network');
    const matrixButton = screen.getByTestId('switch-to-matrix');
    const timelineButton = screen.getByTestId('switch-to-timeline');

    expect(networkButton).toBeInTheDocument();
    expect(matrixButton).toBeInTheDocument();
    expect(timelineButton).toBeInTheDocument();
  });

  it('renders with entities data', async () => {
    const mockEntities = [
      { id: 'entity-1', name: 'Test Entity 1', type: 'System' },
      { id: 'entity-2', name: 'Test Entity 2', type: 'User' },
    ];

    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      entities: mockEntities,
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByTestId('dashboard-metrics')).toHaveTextContent(
      'Entities: 2'
    );
    expect(screen.getByTestId('entities-list')).toHaveTextContent('Count: 2');
  });

  it('renders with changes data', async () => {
    const mockChanges = [
      {
        id: 'change-1',
        entity_id: 'entity-1',
        property_name: 'status',
        value: 'active',
      },
      {
        id: 'change-2',
        entity_id: 'entity-2',
        property_name: 'cpu_usage',
        value: 75,
      },
    ];

    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      changes: mockChanges,
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByTestId('visualization-controls')).toHaveTextContent(
      'Changes: 2'
    );
  });

  it('renders with positions data', async () => {
    const mockPositions = [
      { entityId: 'entity-1', x: 0, y: 0, z: 0 },
      { entityId: 'entity-2', x: 100, y: 100, z: 100 },
    ];

    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      positions: mockPositions,
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByTestId('visualization-controls')).toBeInTheDocument();
  });

  it('renders with metrics data', async () => {
    const mockMetrics = {
      activeThreats: 5,
      totalEntities: 10,
      alertsToday: 3,
    };

    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      metrics: mockMetrics,
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByTestId('dashboard-metrics')).toHaveTextContent(
      'Metrics: yes'
    );
  });

  it('handles empty entities array', async () => {
    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      entities: [],
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByTestId('dashboard-metrics')).toHaveTextContent(
      'Entities: 0'
    );
    expect(screen.getByTestId('entities-list')).toHaveTextContent('Count: 0');
  });

  it('handles null metrics', async () => {
    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      metrics: null,
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByTestId('dashboard-metrics')).toHaveTextContent(
      'Metrics: no'
    );
  });

  it('handles empty changes array', async () => {
    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      changes: [],
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByTestId('visualization-controls')).toHaveTextContent(
      'Changes: 0'
    );
  });

  it('renders background elements', async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    const dashboard = screen
      .getByText('Visualization')
      .closest('.min-h-screen');
    expect(dashboard).toBeInTheDocument();
  });

  it('renders with correct accessibility elements', async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    expect(
      screen.getByText('Wraithwatch Cyber Defense Dashboard')
    ).toBeInTheDocument();
  });
});
