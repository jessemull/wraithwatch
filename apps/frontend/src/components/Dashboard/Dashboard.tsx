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
                    {entities.length} Entities, {changes.length} Changes
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
              <div className="h-[667px] bg-gray-900/50 backdrop-blur-sm rounded-b-xl overflow-hidden p-6">
                {renderVisualization()}
              </div>
            </div>
          </div>

          {/* Right Column - Entity Details and Entities List */}
          <div className="xl:col-span-1 flex flex-col h-[667px]">
            {/* Entity Details Widget */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 shadow-2xl mb-4 flex-1">
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-white">
                  Entity Details
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Select an entity to view detailed information
                </p>
              </div>
              <div className="p-6">
                {selectedEntity ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-md font-medium text-white mb-2">
                        {selectedEntity.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Type: {selectedEntity.type}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Changes Today
                        </p>
                        <p className="text-lg font-semibold text-white">
                          {selectedEntity.changesToday}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Last Seen
                        </p>
                        <p className="text-sm text-gray-300">
                          {new Date(selectedEntity.lastSeen).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {selectedEntity.threatScore && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Threat Score
                        </p>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${selectedEntity.threatScore * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {(selectedEntity.threatScore * 100).toFixed(1)}%
                        </p>
                      </div>
                    )}
                    {selectedEntity.confidence && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          AI Confidence
                        </p>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${selectedEntity.confidence * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {(selectedEntity.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">
                      Click on an entity in the visualization to view details
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Entities List with remaining height */}
            <div className="h-[485px] overflow-hidden">
              <EntitiesList
                entities={entities}
                lastUpdate={new Date().toISOString()}
              />
            </div>
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm mt-8">
          Static data mode - Real-time updates disabled
        </div>
      </div>
    </div>
  );
};
