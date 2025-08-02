import React, { useMemo } from 'react';
import { EntityChange } from '../../types/api';
import { KPICard } from './KPICard';
import { ChartCard } from './ChartCard';
import dynamic from 'next/dynamic';

const BarChart = dynamic(
  () => import('../Charts/BarChart').then(mod => ({ default: mod.BarChart })),
  {
    loading: () => (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading chart...
      </div>
    ),
    ssr: false,
  }
);

const LineChart = dynamic(
  () => import('../Charts/LineChart').then(mod => ({ default: mod.LineChart })),
  {
    loading: () => (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading chart...
      </div>
    ),
    ssr: false,
  }
);

const DoughnutChart = dynamic(
  () =>
    import('../Charts/DoughnutChart').then(mod => ({
      default: mod.DoughnutChart,
    })),
  {
    loading: () => (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading chart...
      </div>
    ),
    ssr: false,
  }
);

const HorizontalBarChart = dynamic(
  () =>
    import('../Charts/HorizontalBarChart').then(mod => ({
      default: mod.HorizontalBarChart,
    })),
  {
    loading: () => (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading chart...
      </div>
    ),
    ssr: false,
  }
);

interface DashboardMetricsProps {
  changes?: EntityChange[];
  entities: unknown[];
  metrics?: any;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  metrics,
}) => {
  const {
    activeThreatsValue,
    threatScoreValue,
    aiConfidenceValue,
    totalConnectionsValue,
  } = useMemo(() => {
    return {
      activeThreatsValue: `+${Math.floor(Math.random() * 5) + 1}`,
      threatScoreValue: `-${(Math.random() * 0.2 + 0.05).toFixed(2)}`,
      aiConfidenceValue: `+${Math.floor(Math.random() * 10) + 1}%`,
      totalConnectionsValue: `+${Math.floor(Math.random() * 50) + 10}`,
    };
  }, []);

  // Use provided metrics or fallback to empty metrics
  const dashboardMetrics = metrics || {
    activeThreats: 0,
    threatScore: '0.00',
    aiConfidence: 0,
    totalConnections: 0,
    threatSeverityDistribution: {},
    aiAgentActivity: {},
    protocolUsage: {},
    entityChangesByDay: {},
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      <div className="xl:col-span-1 space-y-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          Key Performance Indicators
        </h3>
        <KPICard
          title="Active Threats"
          value={dashboardMetrics.activeThreats}
          change={{
            value: activeThreatsValue,
            isPositive: false,
          }}
          comparison="vs previous 24 hours"
        />
        <KPICard
          title="Threat Score"
          value={dashboardMetrics.threatScore}
          change={{
            value: threatScoreValue,
            isPositive: true,
          }}
          comparison="vs previous 24 hours"
        />
        <KPICard
          title="AI Confidence"
          value={`${dashboardMetrics.aiConfidence}%`}
          change={{
            value: aiConfidenceValue,
            isPositive: true,
          }}
          comparison="vs previous 24 hours"
        />
        <KPICard
          title="Total Connections"
          value={dashboardMetrics.totalConnections}
          change={{
            value: totalConnectionsValue,
            isPositive: false,
          }}
          comparison="vs previous 24 hours"
        />
      </div>
      <div className="xl:col-span-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Analytics & Charts
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-8">
            <ChartCard title="Threat Severity Distribution">
              <div className="h-full">
                <BarChart
                  data={dashboardMetrics.threatSeverityDistribution}
                  title="Threat Severity"
                  backgroundColor="rgba(239, 68, 68, 0.8)"
                  borderColor="rgba(239, 68, 68, 1)"
                />
              </div>
            </ChartCard>

            <ChartCard title="Network Status Distribution">
              <div className="h-full">
                <DoughnutChart data={dashboardMetrics.protocolUsage} />
              </div>
            </ChartCard>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <ChartCard title="Entity Changes">
              <div className="h-full">
                <LineChart
                  data={dashboardMetrics.entityChangesByDay}
                  title="Entity Changes"
                  backgroundColor="rgba(74, 222, 128, 0.2)"
                  borderColor="rgba(74, 222, 128, 1)"
                />
              </div>
            </ChartCard>
            <ChartCard title="AI Agent Activity">
              <div className="h-full">
                <HorizontalBarChart
                  data={dashboardMetrics.aiAgentActivity}
                  title="AI Agent Activity"
                  backgroundColor="rgba(59, 130, 246, 0.8)"
                  borderColor="rgba(59, 130, 246, 1)"
                />
              </div>
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
};
