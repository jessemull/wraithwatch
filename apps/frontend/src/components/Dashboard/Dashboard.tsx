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

          {/* Right Column - Entity Details */}
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
                {selectedEntity ? (
                  <div className="space-y-6">
                    {/* Entity Header */}
                    <div className="border-b border-gray-800 pb-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            selectedEntity.type === 'AI_Agent'
                              ? 'bg-blue-500'
                              : selectedEntity.type === 'Threat'
                                ? 'bg-red-500'
                                : selectedEntity.type === 'Network_Node'
                                  ? 'bg-green-500'
                                  : selectedEntity.type === 'System'
                                    ? 'bg-yellow-500'
                                    : selectedEntity.type === 'User'
                                      ? 'bg-purple-500'
                                      : 'bg-gray-500'
                          }`}
                        />
                        <h3 className="text-lg font-semibold text-white">
                          {selectedEntity.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-400">
                        {selectedEntity.type.replace('_', ' ')}
                      </p>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Changes Today
                        </p>
                        <p className="text-2xl font-bold text-white">
                          {selectedEntity.changesToday}
                        </p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Last Seen
                        </p>
                        <p className="text-sm text-gray-300">
                          {new Date(selectedEntity.lastSeen).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Type-specific properties */}
                    {(() => {
                      const renderProperty = (
                        key: string,
                        property: { currentValue: string | number }
                      ) => {
                        const value = property.currentValue;
                        const isNumber = typeof value === 'number';
                        const isString = typeof value === 'string';

                        // Format property name for display
                        const formatPropertyName = (name: string) => {
                          return name
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, l => l.toUpperCase());
                        };

                        // Get appropriate unit for the property
                        const getUnit = (name: string) => {
                          if (name.includes('rate') || name.includes('loss'))
                            return '%';
                          if (name.includes('latency')) return 'ms';
                          if (name.includes('bandwidth')) return 'Mbps';
                          if (name.includes('count')) return '';
                          if (name.includes('duration')) return 'min';
                          return '';
                        };

                        // Get color for status properties
                        const getStatusColor = (
                          name: string,
                          value: string
                        ) => {
                          if (name === 'routing_status') {
                            return value === 'optimal'
                              ? 'bg-green-500 text-white'
                              : value === 'maintenance'
                                ? 'bg-yellow-500 text-black'
                                : value === 'degraded'
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-gray-500 text-white';
                          }
                          if (name === 'severity') {
                            return value === 'critical'
                              ? 'bg-red-500 text-white'
                              : value === 'high'
                                ? 'bg-orange-500 text-white'
                                : value === 'medium'
                                  ? 'bg-yellow-500 text-black'
                                  : value === 'low'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-500 text-white';
                          }
                          if (name === 'mitigation_status') {
                            return value === 'mitigated'
                              ? 'bg-green-500 text-white'
                              : value === 'mitigating'
                                ? 'bg-yellow-500 text-black'
                                : value === 'detected'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-500 text-white';
                          }
                          if (name === 'last_activity') {
                            return value === 'locked'
                              ? 'bg-red-500 text-white'
                              : value === 'offline'
                                ? 'bg-gray-500 text-white'
                                : value === 'active'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-yellow-500 text-black';
                          }
                          if (name === 'permission_level') {
                            return value === 'super_admin'
                              ? 'bg-red-500 text-white'
                              : value === 'admin'
                                ? 'bg-orange-500 text-white'
                                : value === 'user'
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-500 text-white';
                          }
                          return 'bg-gray-500 text-white';
                        };

                        // Skip certain properties that are handled specially
                        if (key === 'source_ip') return null;

                        return (
                          <div
                            key={key}
                            className="bg-gray-800/50 rounded-lg p-2"
                          >
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                              {formatPropertyName(key)}
                            </p>
                            {isNumber ? (
                              <div>
                                <p className="text-lg font-bold text-white">
                                  {value.toFixed(2)}
                                  {getUnit(key)}
                                </p>
                                {/* Progress bar for percentage-like values */}
                                {(key.includes('rate') ||
                                  key.includes('score') ||
                                  key.includes('loss') ||
                                  key.includes('usage')) && (
                                  <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                                    <div
                                      className={`h-1.5 rounded-full transition-all duration-300 ${
                                        value > 70
                                          ? 'bg-red-500'
                                          : value > 40
                                            ? 'bg-yellow-500'
                                            : 'bg-green-500'
                                      }`}
                                      style={{
                                        width: `${Math.min(value, 100)}%`,
                                      }}
                                    ></div>
                                  </div>
                                )}
                              </div>
                            ) : isString ? (
                              <div className="flex items-center space-x-2">
                                {key.includes('status') ||
                                key.includes('severity') ||
                                key.includes('activity') ||
                                key.includes('permission') ? (
                                  <div
                                    className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(key, value)}`}
                                  >
                                    {value.toUpperCase()}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-300 capitalize">
                                    {value.replace('_', ' ')}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-300">
                                {String(value)}
                              </p>
                            )}
                          </div>
                        );
                      };

                      // Get all properties except source_ip
                      const properties = Object.entries(
                        selectedEntity.properties || {}
                      ).filter(([key]) => key !== 'source_ip');

                      // Render properties in a 2-column grid
                      return (
                        <div className="grid grid-cols-2 gap-3">
                          {properties.map(([key, property]) =>
                            renderProperty(key, property)
                          )}
                        </div>
                      );
                    })()}

                    {/* Source IP (special handling for threats) */}
                    {selectedEntity.properties?.source_ip?.currentValue && (
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Source IP
                        </p>
                        <p className="text-sm font-mono text-gray-300">
                          {selectedEntity.properties.source_ip.currentValue}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-800/50 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">
                      No entity selected
                    </p>
                    <p className="text-gray-500 text-xs">
                      Click on an entity in the visualization to view details
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Entities List - Full Width Below */}
        <div className="mt-8">
          <EntitiesList
            entities={entities}
            lastUpdate={new Date().toISOString()}
          />
        </div>

        <div className="text-center text-gray-400 text-sm mt-8">
          Static data mode - Real-time updates disabled
        </div>
      </div>
    </div>
  );
};
