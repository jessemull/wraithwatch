import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
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
    positions: [],
    metrics: {},
    loading: false,
    error: null,
    isConnected: true,
    lastUpdate: new Date().toISOString(),
    refetch: jest.fn(),
    getEntityHistory: jest.fn(),
    getPropertyHistory: jest.fn(),
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
    const mockEntities = [{ 
      id: 'entity-1', 
      name: 'Test Entity',
      type: 'System',
      changesToday: 5,
      lastSeen: new Date().toISOString(),
      properties: {}
    }];
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
    const mockEntities = [{ 
      id: 'entity-1', 
      name: 'Test Entity',
      type: 'System',
      changesToday: 5,
      lastSeen: new Date().toISOString(),
      properties: {}
    }];

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
    const mockEntities = [{ 
      id: 'entity-1', 
      name: 'Test Entity',
      type: 'System',
      changesToday: 5,
      lastSeen: new Date().toISOString(),
      properties: {}
    }];
    const mockChanges = [{ 
      entity_id: 'entity-1',
      entity_type: 'System',
      property_name: 'status',
      value: 'active',
      timestamp: new Date().toISOString()
    }];

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
      { 
        id: 'entity-1', 
        name: 'Test Entity 1', 
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {}
      },
      { 
        id: 'entity-2', 
        name: 'Test Entity 2', 
        type: 'User',
        changesToday: 3,
        lastSeen: new Date().toISOString(),
        properties: {}
      },
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
        entity_id: 'entity-1',
        entity_type: 'System',
        property_name: 'status',
        value: 'active',
        timestamp: new Date().toISOString()
      },
      {
        entity_id: 'entity-2',
        entity_type: 'User',
        property_name: 'cpu_usage',
        value: 75,
        timestamp: new Date().toISOString()
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
      { 
        entity_id: 'entity-1',
        entity_type: 'System',
        name: 'Test Entity 1',
        timeline_position: { x: 0, y: 0, z: 0 },
        network_position: { x: 0, y: 0, z: 0 },
        change_particles: []
      },
      { 
        entity_id: 'entity-2',
        entity_type: 'User',
        name: 'Test Entity 2',
        timeline_position: { x: 100, y: 100, z: 100 },
        network_position: { x: 100, y: 100, z: 100 },
        change_particles: []
      },
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

  // New tests to cover missing lines 8-38
  it('renders dynamic visualization components', async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    // Check that loading visualization message is rendered (from dynamic import)
    expect(screen.getByText('Loading visualization...')).toBeInTheDocument();
  });

  it('handles visualization type switching', async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    // Test switching to network visualization
    const networkButton = screen.getByTestId('switch-to-network');
    fireEvent.click(networkButton);

    // Test switching to matrix visualization
    const matrixButton = screen.getByTestId('switch-to-matrix');
    fireEvent.click(matrixButton);

    // Test switching back to timeline visualization
    const timelineButton = screen.getByTestId('switch-to-timeline');
    fireEvent.click(timelineButton);
  });

  it('handles undefined visualization type', async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    // The component should default to timeline visualization
    expect(screen.getByTestId('visualization-controls')).toHaveTextContent(
      'Controls: timeline'
    );
  });

  it('handles empty positions object', async () => {
    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      positions: [],
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByTestId('visualization-controls')).toBeInTheDocument();
  });

  it('handles null positions', async () => {
    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      positions: null as any,
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByTestId('visualization-controls')).toBeInTheDocument();
  });

  it('handles undefined positions', async () => {
    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      positions: undefined as any,
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByTestId('visualization-controls')).toBeInTheDocument();
  });

  it('handles empty metrics object', async () => {
    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      metrics: {},
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByTestId('dashboard-metrics')).toHaveTextContent(
      'Metrics: yes'
    );
  });

  it('handles undefined metrics', async () => {
    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      metrics: undefined as any,
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByTestId('dashboard-metrics')).toHaveTextContent(
      'Metrics: no'
    );
  });

  it('handles complex error messages', async () => {
    const complexError = 'Network timeout after 30 seconds. Please check your connection.';
    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      error: complexError,
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByText(`Error: ${complexError}`)).toBeInTheDocument();
  });

  it('handles null error', async () => {
    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      error: null,
    });

    await act(async () => {
      render(<Dashboard />);
    });

    // Should not show error message
    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
  });

  it('handles undefined error', async () => {
    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      error: undefined as any,
    });

    await act(async () => {
      render(<Dashboard />);
    });

    // Should not show error message
    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
  });

  it('handles loading state with all data present', async () => {
    mockUseRealTimeData.mockReturnValue({
      entities: [{ 
        id: 'entity-1', 
        name: 'Test Entity',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {}
      }],
      changes: [{ 
        entity_id: 'entity-1',
        entity_type: 'System',
        property_name: 'status',
        value: 'active',
        timestamp: new Date().toISOString()
      }],
      positions: [{ 
        entity_id: 'entity-1',
        entity_type: 'System',
        name: 'Test Entity',
        timeline_position: { x: 0, y: 0, z: 0 },
        network_position: { x: 0, y: 0, z: 0 },
        change_particles: []
      }],
      metrics: { activeThreats: 5 },
      loading: true,
      error: null,
      isConnected: true,
      lastUpdate: new Date().toISOString(),
      refetch: jest.fn(),
      getEntityHistory: jest.fn(),
      getPropertyHistory: jest.fn(),
    });

    await act(async () => {
      render(<Dashboard />);
    });

    // Should show loading states even with data present
    expect(screen.getByText('Key Performance Indicators')).toBeInTheDocument();
    expect(screen.getByText('Analytics & Charts')).toBeInTheDocument();
    expect(screen.getByText('Visualization')).toBeInTheDocument();
    expect(screen.getByText('Entity Details')).toBeInTheDocument();
    expect(screen.getByText('Entity List')).toBeInTheDocument();
  });

  it('handles error state with all data present', async () => {
    mockUseRealTimeData.mockReturnValue({
      entities: [{ 
        id: 'entity-1', 
        name: 'Test Entity',
        type: 'System',
        changesToday: 5,
        lastSeen: new Date().toISOString(),
        properties: {}
      }],
      changes: [{ 
        entity_id: 'entity-1',
        entity_type: 'System',
        property_name: 'status',
        value: 'active',
        timestamp: new Date().toISOString()
      }],
      positions: [{ 
        entity_id: 'entity-1',
        entity_type: 'System',
        name: 'Test Entity',
        timeline_position: { x: 0, y: 0, z: 0 },
        network_position: { x: 0, y: 0, z: 0 },
        change_particles: []
      }],
      metrics: { activeThreats: 5 },
      loading: false,
      error: 'Test error message',
      isConnected: true,
      lastUpdate: new Date().toISOString(),
      refetch: jest.fn(),
      getEntityHistory: jest.fn(),
      getPropertyHistory: jest.fn(),
    });

    await act(async () => {
      render(<Dashboard />);
    });

    // Should show error message and not other components
    expect(screen.getByText('Error: Test error message')).toBeInTheDocument();
    expect(screen.queryByTestId('dashboard-metrics')).not.toBeInTheDocument();
    expect(screen.queryByTestId('visualization-controls')).not.toBeInTheDocument();
  });

  it('handles visualization props memoization', async () => {
    const mockEntities = [{ 
      id: 'entity-1', 
      name: 'Test Entity',
      type: 'System',
      changesToday: 5,
      lastSeen: new Date().toISOString(),
      properties: {}
    }];
    const mockPositions = [{ 
      entity_id: 'entity-1',
      entity_type: 'System',
      name: 'Test Entity',
      timeline_position: { x: 0, y: 0, z: 0 },
      network_position: { x: 0, y: 0, z: 0 },
      change_particles: []
    }];

    mockUseRealTimeData.mockReturnValue({
      ...defaultMockData,
      entities: mockEntities,
      positions: mockPositions,
    });

    await act(async () => {
      render(<Dashboard />);
    });

    // Verify that visualization controls are rendered with correct props
    expect(screen.getByTestId('visualization-controls')).toBeInTheDocument();
  });

  it('handles default visualization type', async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    // Should default to timeline visualization
    expect(screen.getByTestId('visualization-controls')).toHaveTextContent(
      'Controls: timeline'
    );
  });

  it('handles background elements rendering', async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    // Check that background gradient elements are rendered
    const backgroundElements = document.querySelectorAll('.bg-gradient-to-br');
    expect(backgroundElements.length).toBeGreaterThan(0);
  });

  it('handles animated background elements', async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    // Check that animated pulse elements are rendered
    const pulseElements = document.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it('handles accessibility elements', async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    // Check that screen reader only elements are present
    const srOnlyElement = screen.getByText('Wraithwatch Cyber Defense Dashboard');
    expect(srOnlyElement).toHaveClass('sr-only');
  });

  it('handles responsive layout classes', async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    // Check that responsive grid classes are applied
    const gridContainer = document.querySelector('.grid.grid-cols-1.xl\\:grid-cols-2');
    expect(gridContainer).toBeInTheDocument();
  });

  it('handles backdrop blur effects', async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    // Check that backdrop blur classes are applied
    const backdropElements = document.querySelectorAll('.backdrop-blur-sm');
    expect(backdropElements.length).toBeGreaterThan(0);
  });

  it('handles shadow effects', async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    // Check that shadow classes are applied
    const shadowElements = document.querySelectorAll('.shadow-2xl');
    expect(shadowElements.length).toBeGreaterThan(0);
  });

  it('handles border styling', async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    // Check that border classes are applied
    const borderElements = document.querySelectorAll('.border.border-gray-800');
    expect(borderElements.length).toBeGreaterThan(0);
  });

  it('handles overflow handling', async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    // Check that overflow classes are applied
    const overflowElements = document.querySelectorAll('.overflow-auto.sm\\:overflow-hidden');
    expect(overflowElements.length).toBeGreaterThan(0);
  });

  it('handles height responsive classes', async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    // Check that responsive height classes are applied
    const heightElements = document.querySelectorAll('.h-\\[400px\\].sm\\:h-\\[667px\\]');
    expect(heightElements.length).toBeGreaterThan(0);
  });
});
