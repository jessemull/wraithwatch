'use client';

import { useState, useMemo, useCallback } from 'react';
import { Entity, AggregatedEntityGroup } from '../../types';
import { EntityGroupHeader } from './EntityGroupHeader';
import { EntityItem } from './EntityItem';
import { formatTime } from '../../util/entity';

interface EntitiesListProps {
  entities: Entity[];
  lastUpdate?: string;
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
          {entities.length} Total Entities
          {lastUpdate && (
            <span className="ml-2 text-blue-400">
              • Last Update: {formatTime(lastUpdate)}
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
