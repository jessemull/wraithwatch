import React from 'react';
import { Entity } from '../../types/entity';
import {
  getEntityTypeColor,
  getStatusColor,
  formatPropertyName,
  getUnit,
  formatEntityType,
  getEntityName,
} from '../../util/entity';

interface EntityDetailsProps {
  selectedEntity: Entity | undefined;
}

export const EntityDetails: React.FC<EntityDetailsProps> = ({
  selectedEntity,
}) => {
  const renderProperty = (
    key: string,
    property: { currentValue: string | number; lastChanged?: string }
  ) => {
    const value = property.currentValue;
    const isNumber = typeof value === 'number';
    const isString = typeof value === 'string';

    // Skip certain properties that are handled specially...

    if (key === 'source_ip') return null;

    return (
      <div key={key} className="bg-gray-800/50 rounded-lg p-2 relative">
        {/* Last Modified Indicator */}
        {property.lastChanged && (
          <div className="absolute top-2 right-2 text-white text-xs px-2 py-1 font-medium">
            {new Date(property.lastChanged).toLocaleTimeString()}
          </div>
        )}
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
            {getEntityName(selectedEntity.id)}
          </h3>
        </div>
        <p className="text-sm text-gray-400">
          {formatEntityType(selectedEntity.type)}
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
        <div className="bg-gray-800/50 rounded-lg p-3 relative">
          {/* Last Modified Indicator */}
          {selectedEntity.properties.source_ip.lastChanged && (
            <div className="absolute top-2 right-2 text-white text-xs px-2 py-1 font-medium">
              {new Date(
                selectedEntity.properties.source_ip.lastChanged
              ).toLocaleTimeString()}
            </div>
          )}
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
