'use client';

import { useState } from 'react';
import { Entity } from '../../types';

interface EntitiesListProps {
  entities: Entity[];
  lastUpdate?: string;
}

const getEntityTypeColor = (entityType: string): string => {
  switch (entityType) {
    case 'AI_Agent':
      return 'bg-blue-500';
    case 'Network_Node':
      return 'bg-green-500';
    case 'Threat':
      return 'bg-red-500';
    case 'System':
      return 'bg-yellow-500';
    case 'User':
      return 'bg-purple-500';
    case 'Sensor':
      return 'bg-cyan-500';
    case 'Server':
      return 'bg-orange-500';
    case 'Workstation':
      return 'bg-indigo-500';
    default:
      return 'bg-gray-500';
  }
};

const aggregateEntitiesByType = (entities: Entity[]) => {
  const aggregated = entities.reduce((acc, entity) => {
    if (!acc[entity.type]) {
      acc[entity.type] = [];
    }
    acc[entity.type].push(entity);
    return acc;
  }, {} as Record<string, Entity[]>);

  return Object.entries(aggregated).map(([type, entities]) => ({
    type,
    entities,
    totalChanges: entities.reduce((sum, entity) => sum + entity.changesToday, 0),
    lastSeen: entities.reduce((latest, entity) => {
      const entityDate = new Date(entity.lastSeen);
      const latestDate = latest ? new Date(latest) : new Date(0);
      return entityDate > latestDate ? entity.lastSeen : latest;
    }, ''),
  }));
};

export const EntitiesList: React.FC<EntitiesListProps> = ({
  entities,
  lastUpdate,
}) => {
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const aggregatedData = aggregateEntitiesByType(entities);

  const toggleType = (type: string) => {
    if (expandedType === type) {
      setExpandedType(null);
    } else {
      setExpandedType(type);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 shadow-2xl">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">Entities</h2>
        <p className="text-sm text-gray-400 mt-1">
          {entities.length} total entities
          {lastUpdate && (
            <span className="ml-2 text-blue-400">
              • Last update: {new Date(lastUpdate).toLocaleTimeString()}
            </span>
          )}
        </p>
      </div>
      <div className="divide-y divide-gray-800">
        {aggregatedData.map(({ type, entities, totalChanges, lastSeen }) => (
          <div key={type}>
            {/* Accordion Header */}
            <div
              className="px-6 py-4 hover:bg-gray-800/50 cursor-pointer transition-colors duration-200"
              onClick={() => toggleType(type)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${getEntityTypeColor(type)}`}
                  />
                  <div>
                    <h3 className="text-sm font-medium text-white">
                      {type.replace('_', ' ')}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {entities.length} {entities.length === 1 ? 'entity' : 'entities'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-white">
                      {totalChanges} changes today
                    </p>
                    <p className="text-xs text-gray-400">
                      Last seen: {new Date(lastSeen).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className={`transform transition-transform duration-200 ${
                    expandedType === type ? 'rotate-180' : ''
                  }`}>
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion Content */}
            {expandedType === type && (
              <div className="bg-gray-700/30 border-t border-gray-800">
                <div className="divide-y divide-gray-600">
                  {entities.map(entity => (
                    <div
                      key={entity.id}
                      className="px-6 py-3 hover:bg-gray-600/50 cursor-pointer transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full ${getEntityTypeColor(entity.type)}`}
                          />
                          <div>
                            <h4 className="text-sm font-medium text-white">
                              {entity.name}
                            </h4>
                            <p className="text-xs text-gray-400">{entity.type}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-white">
                            {entity.changesToday} changes today
                          </p>
                          <p className="text-xs text-gray-400">
                            Last seen: {new Date(entity.lastSeen).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
