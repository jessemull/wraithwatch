import React from 'react';
import { EntityChange } from '../../types/api';
import { KPICard } from './KPICard';
import { ChartCard } from './ChartCard';
import { BarChart, PieChart, LineChart, DoughnutChart, HorizontalBarChart } from './Charts';
import { useAggregatedData } from '../../hooks/useAggregatedData';

interface DashboardMetricsProps {
  entities: any[];
  changes: EntityChange[];
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  entities,
  changes,
}) => {
  const metrics = useAggregatedData(changes);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      {/* KPI Cards - Stacked on the left */}
      <div className="xl:col-span-1 space-y-6">
        <KPICard
          title="Active Threats"
          value={metrics.activeThreats}
          change={{ value: `+${Math.floor(Math.random() * 5) + 1}`, isPositive: false }}
          comparison="vs previous 24 hours"
        />
        <KPICard
          title="Threat Score"
          value={metrics.threatScore}
          change={{ value: `-${(Math.random() * 0.2 + 0.05).toFixed(2)}`, isPositive: true }}
          comparison="vs previous 24 hours"
        />
        <KPICard
          title="AI Confidence"
          value={`${metrics.aiConfidence}%`}
          change={{ value: `+${Math.floor(Math.random() * 10) + 1}%`, isPositive: true }}
          comparison="vs previous 24 hours"
        />
        <KPICard
          title="Total Connections"
          value={metrics.totalConnections}
          change={{ value: `+${Math.floor(Math.random() * 50) + 10}`, isPositive: false }}
          comparison="vs previous 24 hours"
        />
      </div>

      {/* Chart Cards - 2x2 grid on the right */}
      <div className="xl:col-span-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Threat Severity Distribution">
          <div className="h-full">
            <HorizontalBarChart 
              data={metrics.threatSeverityDistribution}
              title="Threat Severity"
              backgroundColor="rgba(239, 68, 68, 0.8)"
              borderColor="rgba(239, 68, 68, 1)"
            />
          </div>
        </ChartCard>

        <ChartCard title="Network Status Distribution">
          <div className="h-full">
            <DoughnutChart 
              data={metrics.protocolUsage}
              title="Network Status"
            />
          </div>
        </ChartCard>

        <ChartCard title="Entity Changes">
          <div className="h-full">
            <LineChart 
              data={metrics.entityChangesByDay}
              title="Entity Changes"
              backgroundColor="rgba(168, 85, 247, 0.2)"
              borderColor="rgba(168, 85, 247, 1)"
            />
          </div>
        </ChartCard>

        <ChartCard title="AI Agent Activity">
          <div className="h-full">
            <HorizontalBarChart 
              data={metrics.aiAgentActivity}
              title="AI Agent Activity"
              backgroundColor="rgba(59, 130, 246, 0.8)"
              borderColor="rgba(59, 130, 246, 1)"
            />
          </div>
        </ChartCard>
      </div>
    </div>
  );
}; 