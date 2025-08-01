import React from 'react';
import { EntityChange } from '../../types/api';
import { KPICard } from './KPICard';
import { ChartCard } from './ChartCard';
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
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Chart Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Threat Severity Distribution">
          <div className="flex items-end justify-between h-full p-4">
            {Object.entries(metrics.threatSeverityDistribution).map(([severity, count]) => {
              const maxCount = Math.max(...Object.values(metrics.threatSeverityDistribution));
              const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
              const colors = {
                critical: 'bg-red-500',
                high: 'bg-orange-500',
                medium: 'bg-yellow-500',
                low: 'bg-green-500',
              };
              
              return (
                <div key={severity} className="flex flex-col items-center">
                  <div 
                    className={`w-8 ${colors[severity as keyof typeof colors] || 'bg-gray-500'} rounded-t`} 
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-400 mt-2">{severity}</span>
                  <span className="text-xs text-gray-500">{count}</span>
                </div>
              );
            })}
          </div>
        </ChartCard>

        <ChartCard title="AI Agent Activity">
          <div className="flex items-end justify-between h-full p-4">
            {Object.entries(metrics.aiAgentActivity).map(([status, count]) => {
              const maxCount = Math.max(...Object.values(metrics.aiAgentActivity));
              const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
              
              return (
                <div key={status} className="flex flex-col items-center">
                  <div 
                    className="w-6 bg-blue-500 rounded-t" 
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-400 mt-2">{status}</span>
                  <span className="text-xs text-gray-500">{count}</span>
                </div>
              );
            })}
          </div>
        </ChartCard>

        <ChartCard title="Network Status Distribution">
          <div className="flex items-center justify-center h-full">
            <div className="grid grid-cols-2 gap-4 text-center">
              {Object.entries(metrics.protocolUsage).map(([status, count], index) => {
                const total = Object.values(metrics.protocolUsage).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
                
                return (
                  <div key={status} className="flex items-center">
                    <div className={`w-4 h-4 ${colors[index % colors.length]} rounded mr-2`}></div>
                    <span className="text-sm text-gray-300">{status} ({percentage}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Entity Changes">
          <div className="flex items-end justify-between h-full p-4">
            {Object.entries(metrics.entityChangesByDay).map(([date, count], index) => {
              const maxCount = Math.max(...Object.values(metrics.entityChangesByDay));
              const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
              const dayLabel = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
              
              return (
                <div key={date} className="flex flex-col items-center">
                  <div 
                    className="w-4 bg-purple-500 rounded-t" 
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-400 mt-2">{dayLabel}</span>
                  <span className="text-xs text-gray-500">{count}</span>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}; 