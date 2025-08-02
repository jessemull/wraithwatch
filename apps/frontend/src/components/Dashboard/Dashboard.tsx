'use client';

import {
  EntitiesList,
  TimelineVisualization,
  NetworkGraph3D,
  Globe3D,
  Matrix3D,
} from '../index';
import { Header } from './Header';
import { DashboardMetrics } from './DashboardMetrics';
import { EntityDetails } from './EntityDetails';
import { VisualizationControls } from './VisualizationControls';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import { useState, useMemo } from 'react';
import { Entity } from '../../types/entity';
import { VisualizationType } from '../../types/visualization';

export const Dashboard: React.FC = () => {
  const { entities, changes, positions, loading, error } = useRealTimeData();
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
      case 'globe':
        return <Globe3D {...visualizationProps} />;
      case 'matrix':
        return <Matrix3D {...visualizationProps} />;
      default:
        return <TimelineVisualization {...visualizationProps} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading entity data...</div>
      </div>
    );
  }

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
          <DashboardMetrics entities={entities} changes={changes} />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="xl:col-span-1">
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
          </div>
          <div className="xl:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 shadow-2xl">
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-white">
                  Entity Details
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Select an entity to view detailed information
                </p>
              </div>
              <div className="h-[667px] bg-gray-900/50 backdrop-blur-sm rounded-b-xl overflow-hidden p-6">
                <EntityDetails selectedEntity={selectedEntity} />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <EntitiesList
            entities={entities}
            lastUpdate={new Date().toISOString()}
          />
        </div>
        <div className="text-center text-gray-400 text-sm mt-8">
          Real-Time Mode - Entities Updating Dynamically
        </div>
      </div>
    </div>
  );
};
