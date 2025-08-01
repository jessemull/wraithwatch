'use client';

import { useState, useMemo, useCallback } from 'react';
import { Entity } from '../../types';
import { getEntityTypeColor, formatTime } from '../../util/entity';

interface EntitiesListProps {
  entities: Entity[];
  lastUpdate?: string;
}

interface AggregatedEntityGroup {
  type: string;
  entities: Entity[];
  totalChanges: number;
  lastSeen: string;
}

const aggregateEntitiesByType = (
  entities: Entity[]
): AggregatedEntityGroup[] => {
  const aggregated = entities.reduce(
    (acc, entity) => {
      if (!acc[entity.type]) {
        acc[entity.type] = [];
      }
      acc[entity.type].push(entity);
      return acc;
    },
    {} as Record<string, Entity[]>
  );

  return Object.entries(aggregated).map(([type, entities]) => ({
    type,
    entities,
    totalChanges: entities.reduce(
      (sum, entity) => sum + entity.changesToday,
      0
    ),
    lastSeen: entities.reduce((latest, entity) => {
      const entityDate = new Date(entity.lastSeen);
      const latestDate = latest ? new Date(latest) : new Date(0);
      return entityDate > latestDate ? entity.lastSeen : latest;
    }, ''),
  }));
};

interface EntityGroupHeaderProps {
  type: string;
  entities: Entity[];
  totalChanges: number;
  lastSeen: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const EntityGroupHeader: React.FC<EntityGroupHeaderProps> = ({
  type,
  entities,
  totalChanges,
  lastSeen,
  isExpanded,
  onToggle,
}) => (
  <div
    className="px-6 py-4 hover:bg-gray-800/50 cursor-pointer transition-colors duration-200"
    onClick={onToggle}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${getEntityTypeColor(type)}`} />
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
          <p className="text-sm text-white">{totalChanges} changes today</p>
          <p className="text-xs text-gray-400">
            Last seen: {formatTime(lastSeen)}
          </p>
        </div>
        <div
          className={`transform transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
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
);

interface EntityItemProps {
  entity: Entity;
}

const EntityItem: React.FC<EntityItemProps> = ({ entity }) => (
  <div className="px-6 py-3 hover:bg-gray-600/50 cursor-pointer transition-colors duration-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div
          className={`w-2 h-2 rounded-full ${getEntityTypeColor(entity.type)}`}
        />
        <div>
          <h4 className="text-sm font-medium text-white">{entity.name}</h4>
          <p className="text-xs text-gray-400">{entity.type}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm text-white">
          {entity.changesToday} changes today
        </p>
        <p className="text-xs text-gray-400">
          Last seen: {formatTime(entity.lastSeen)}
        </p>
      </div>
    </div>
  </div>
);

export const EntitiesList: React.FC<EntitiesListProps> = ({
  entities,
  lastUpdate,
}) => {
  const [expandedType, setExpandedType] = useState<string | null>(null);

  // Memoize aggregated data to prevent recalculation on every render...

  const aggregatedData = useMemo(
    () => aggregateEntitiesByType(entities),
    [entities]
  );

  // Memoize toggle function to prevent unnecessary re-renders...

  const toggleType = useCallback((type: string) => {
    setExpandedType(prev => (prev === type ? null : type));
  }, []);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 shadow-2xl h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-800 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white">Entities</h2>
        <p className="text-sm text-gray-400 mt-1">
          {entities.length} total entities
          {lastUpdate && (
            <span className="ml-2 text-blue-400">
              • Last update: {formatTime(lastUpdate)}
            </span>
          )}
        </p>
      </div>
      <div className="divide-y divide-gray-800 flex-1 overflow-y-auto">
        {aggregatedData.map(({ type, entities, totalChanges, lastSeen }) => (
          <div key={type}>
            <EntityGroupHeader
              type={type}
              entities={entities}
              totalChanges={totalChanges}
              lastSeen={lastSeen}
              isExpanded={expandedType === type}
              onToggle={() => toggleType(type)}
            />
            {expandedType === type && (
              <div className="bg-gray-700/30 border-t border-gray-800">
                <div className="divide-y divide-gray-600">
                  {entities.map(entity => (
                    <EntityItem key={entity.id} entity={entity} />
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
