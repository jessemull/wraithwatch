import React from 'react';
import { Entity } from '../../types/entity';

interface EntityDetailsProps {
  selectedEntity: Entity | undefined;
}

export const EntityDetails: React.FC<EntityDetailsProps> = ({
  selectedEntity,
}) => {
  const formatPropertyName = (name: string) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getUnit = (name: string) => {
    if (name.includes('rate') || name.includes('loss')) return '%';
    if (name.includes('latency')) return 'ms';
    if (name.includes('bandwidth')) return 'Mbps';
    if (name.includes('count')) return '';
    if (name.includes('duration')) return 'min';
    return '';
  };

  const getStatusColor = (name: string, value: string) => {
    const statusColors = {
      routing_status: {
        optimal: 'bg-green-500 text-white',
        maintenance: 'bg-yellow-500 text-black',
        degraded: 'bg-orange-500 text-white',
        default: 'bg-gray-500 text-white',
      },
      severity: {
        critical: 'bg-red-500 text-white',
        high: 'bg-orange-500 text-white',
        medium: 'bg-yellow-500 text-black',
        low: 'bg-green-500 text-white',
        default: 'bg-gray-500 text-white',
      },
      mitigation_status: {
        mitigated: 'bg-green-500 text-white',
        mitigating: 'bg-yellow-500 text-black',
        detected: 'bg-red-500 text-white',
        default: 'bg-gray-500 text-white',
      },
      last_activity: {
        locked: 'bg-red-500 text-white',
        offline: 'bg-gray-500 text-white',
        active: 'bg-green-500 text-white',
        default: 'bg-yellow-500 text-black',
      },
      permission_level: {
        super_admin: 'bg-red-500 text-white',
        admin: 'bg-orange-500 text-white',
        user: 'bg-blue-500 text-white',
        default: 'bg-gray-500 text-white',
      },
    };

    const colorMap = statusColors[name as keyof typeof statusColors];

    if (colorMap) {
      return colorMap[value as keyof typeof colorMap] || colorMap.default;
    }

    return 'bg-gray-500 text-white';
  };

  const getEntityTypeColor = (type: string) => {
    const typeColors = {
      AI_Agent: 'bg-blue-500',
      Threat: 'bg-red-500',
      Network_Node: 'bg-green-500',
      System: 'bg-yellow-500',
      User: 'bg-purple-500',
    };
    return typeColors[type as keyof typeof typeColors] || 'bg-gray-500';
  };

  const renderProperty = (
    key: string,
    property: { currentValue: string | number }
  ) => {
    const value = property.currentValue;
    const isNumber = typeof value === 'number';
    const isString = typeof value === 'string';

    // Skip certain properties that are handled specially...

    if (key === 'source_ip') return null;

    return (
      <div key={key} className="bg-gray-800/50 rounded-lg p-2">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {formatPropertyName(key)}
        </p>
        {isNumber ? (
          <div>
            <p className="text-lg font-bold text-white">
              {value.toFixed(2)}
              {getUnit(key)}
            </p>
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
          <p className="text-sm text-gray-300">{String(value)}</p>
        )}
      </div>
    );
  };

  if (!selectedEntity) {
    return (
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
        <p className="text-gray-400 text-sm mb-2">No entity selected</p>
        <p className="text-gray-500 text-xs">
          Click on an entity in the visualization to view details
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-800 pb-4">
        <div className="flex items-center space-x-3 mb-3">
          <div
            className={`w-4 h-4 rounded-full ${getEntityTypeColor(selectedEntity.type)}`}
          />
          <h3 className="text-lg font-semibold text-white">
            {selectedEntity.name}
          </h3>
        </div>
        <p className="text-sm text-gray-400">
          {selectedEntity.type.replace('_', ' ')}
        </p>
      </div>
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
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(selectedEntity.properties || {})
          .filter(([key]) => key !== 'source_ip')
          .map(([key, property]) => renderProperty(key, property))}
      </div>
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
  );
};
