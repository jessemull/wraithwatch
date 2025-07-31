'use client';

import { Entity } from '../../types';

interface EntitiesListProps {
  entities: Entity[];
  lastUpdate?: string;
}

export const EntitiesList: React.FC<EntitiesListProps> = ({
  entities,
  lastUpdate,
}) => {
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
        {entities.map(entity => (
          <div
            key={entity.id}
            className="px-6 py-4 hover:bg-gray-800/50 cursor-pointer transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    entity.type === 'AI_Agent'
                      ? 'bg-blue-500'
                      : entity.type === 'Network_Node'
                        ? 'bg-green-500'
                        : entity.type === 'Threat'
                          ? 'bg-red-500'
                          : entity.type === 'System'
                            ? 'bg-yellow-500'
                            : entity.type === 'User'
                              ? 'bg-purple-500'
                              : 'bg-cyan-500'
                  }`}
                />
                <div>
                  <h3 className="text-sm font-medium text-white">
                    {entity.name}
                  </h3>
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
  );
};
