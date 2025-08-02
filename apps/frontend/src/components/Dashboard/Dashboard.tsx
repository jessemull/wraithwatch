'use client';

import { EntitiesList } from '../index';
import dynamic from 'next/dynamic';

const TimelineVisualization = dynamic(
  () =>
    import('../Visualizations/TimelineVisualization').then(mod => ({
      default: mod.TimelineVisualization,
    })),
  {
    loading: () => (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading visualization...
      </div>
    ),
    ssr: false,
  }
);

const NetworkGraph3D = dynamic(
  () =>
    import('../Visualizations/NetworkVisualization').then(mod => ({
      default: mod.NetworkGraph3D,
    })),
  {
    loading: () => (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading visualization...
      </div>
    ),
    ssr: false,
  }
);

const Matrix3D = dynamic(
  () =>
    import('../Visualizations/MatrixVisualization').then(mod => ({
      default: mod.Matrix3D,
    })),
  {
    loading: () => (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading visualization...
      </div>
    ),
    ssr: false,
  }
);
import { Header } from './Header';
import { DashboardMetrics } from './DashboardMetrics';
import { EntityDetails } from './EntityDetails';
import { VisualizationControls } from './VisualizationControls';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import { useState, useMemo } from 'react';
import { Entity } from '../../types/entity';
import { VisualizationType } from '../../types/visualization';

export const Dashboard: React.FC = () => {
  const { entities, changes, positions, metrics, loading, error } =
    useRealTimeData();
  const [selectedEntity, setSelectedEntity] = useState<Entity | undefined>();
  const [visualizationType, setVisualizationType] =
    useState<VisualizationType>('timeline');

  const visualizationProps = useMemo(
    () => ({
      entities,
      positions,
      selectedEntity,
      onEntitySelect: setSelectedEntity,
    }),
    [entities, positions, selectedEntity]
  );

  const renderVisualization = () => {
    switch (visualizationType) {
      case 'timeline':
        return <TimelineVisualization {...visualizationProps} />;
      case 'network':
        return <NetworkGraph3D {...visualizationProps} />;
      case 'matrix':
        return <Matrix3D {...visualizationProps} />;
      default:
        return <TimelineVisualization {...visualizationProps} />;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Header />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-black/20"></div>
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-40 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/3 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-500"></div>
      </div>
      <div className="relative px-4 py-8">
        <div className="mb-8">
          <h1 className="sr-only">Wraithwatch Cyber Defense Dashboard</h1>
          <h2 className="text-xl font-semibold text-white mb-4">
            Dashboard Metrics
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              <div className="xl:col-span-1 space-y-8">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Key Performance Indicators
                </h3>
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-lg animate-pulse"
                  >
                    <div className="h-4 bg-gray-700 rounded mb-3"></div>
                    <div className="h-8 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
              <div className="xl:col-span-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Analytics & Charts
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-lg animate-pulse"
                    >
                      <div className="h-4 bg-gray-700 rounded mb-3"></div>
                      <div className="h-60 bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <DashboardMetrics entities={entities} metrics={metrics} />
          )}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="xl:col-span-1">
            <h2 className="text-xl font-semibold text-white mb-4">
              Visualization
            </h2>
            {loading ? (
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 shadow-2xl animate-pulse">
                <div className="px-6 py-4 border-b border-gray-800">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                </div>
                <div className="h-[667px] bg-gray-700/20 rounded-b-xl"></div>
              </div>
            ) : (
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 shadow-2xl">
                <VisualizationControls
                  visualizationType={visualizationType}
                  onVisualizationTypeChange={setVisualizationType}
                  entitiesCount={entities.length}
                  changesCount={changes.length}
                />
                <div className="h-[667px] bg-gray-900/50 backdrop-blur-sm rounded-b-xl overflow-hidden p-6">
                  {renderVisualization()}
                </div>
              </div>
            )}
          </div>
          <div className="xl:col-span-1">
            <h2 className="text-xl font-semibold text-white mb-4">
              Entity Details
            </h2>
            {loading ? (
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 shadow-2xl animate-pulse">
                <div className="px-6 py-4 border-b border-gray-800">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="h-[667px] bg-gray-700/20 rounded-b-xl"></div>
              </div>
            ) : (
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 shadow-2xl">
                <div className="px-6 py-4 border-b border-gray-800">
                  <h3 className="text-lg font-semibold text-white">
                    Entity Details
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Select an entity to view detailed information
                  </p>
                </div>
                <div className="h-[667px] bg-gray-900/50 backdrop-blur-sm rounded-b-xl overflow-hidden p-6">
                  <EntityDetails selectedEntity={selectedEntity} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Entity List</h2>
          {loading ? (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 shadow-2xl animate-pulse">
              <div className="px-6 py-4 border-b border-gray-800">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/3"></div>
              </div>
              <div className="p-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-gray-800 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-700 rounded w-24 mb-1"></div>
                        <div className="h-3 bg-gray-700 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-700 rounded w-12"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EntitiesList
              entities={entities}
              lastUpdate={new Date().toISOString()}
            />
          )}
        </div>
        <div className="text-center text-gray-400 text-sm mt-8">
          Real-Time Mode - Entities Updating Dynamically
        </div>
      </div>
    </div>
  );
};
