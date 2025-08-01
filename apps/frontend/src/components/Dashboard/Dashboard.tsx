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
import { useEntityData } from '../../hooks/useEntityData';
import { useState } from 'react';
import { Entity } from '../../types/entity';

type VisualizationType = 'timeline' | 'network' | 'globe' | 'matrix';

export const Dashboard: React.FC = () => {
  const { entities, changes, loading, error } = useEntityData();
  const [selectedEntity, setSelectedEntity] = useState<Entity | undefined>();
  const [visualizationType, setVisualizationType] =
    useState<VisualizationType>('timeline');

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

  const renderVisualization = () => {
    const props = {
      entities,
      changes,
      selectedEntity,
      onEntitySelect: setSelectedEntity,
    };

    switch (visualizationType) {
      case 'timeline':
        return <TimelineVisualization {...props} />;
      case 'network':
        return <NetworkGraph3D {...props} />;
      case 'globe':
        return <Globe3D {...props} />;
      case 'matrix':
        return <Matrix3D {...props} />;
      default:
        return <TimelineVisualization {...props} />;
    }
  };

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
        {/* Dashboard Metrics */}
        <div className="mb-8">
          <DashboardMetrics entities={entities} changes={changes} />
        </div>

        {/* Visualization Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* 3D Visualization */}
          <div className="xl:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 shadow-2xl">
              <div className="px-6 py-4 border-b border-gray-800">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      3D Entity Visualization
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Interactive 3D view of entity changes over time (
                      {entities.length} entities, {changes.length} changes)
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setVisualizationType('timeline')}
                      className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                        visualizationType === 'timeline'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Timeline
                    </button>
                    <button
                      onClick={() => setVisualizationType('network')}
                      className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                        visualizationType === 'network'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Network
                    </button>
                    <button
                      onClick={() => setVisualizationType('globe')}
                      className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                        visualizationType === 'globe'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Globe
                    </button>
                    <button
                      onClick={() => setVisualizationType('matrix')}
                      className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                        visualizationType === 'matrix'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Matrix
                    </button>
                  </div>
                </div>
              </div>
              <div className="h-[600px] bg-gray-900/50 backdrop-blur-sm rounded-b-xl overflow-hidden p-6">
                {renderVisualization()}
              </div>
            </div>
          </div>

          {/* Entities List */}
          <div className="xl:col-span-1">
            <EntitiesList
              entities={entities}
              lastUpdate={new Date().toISOString()}
            />
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm mt-8">
          Static data mode - Real-time updates disabled
        </div>
      </div>
    </div>
  );
};
