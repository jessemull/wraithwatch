import React from 'react';
import { EntityItemProps } from '../../types/entity';
import { getEntityTypeColor, formatTime, formatEntityType, getUnit, getStatusColor, formatText } from '../../util/entity';

export const EntityItem: React.FC<EntityItemProps> = ({ entity }) => {
  const getKeyProperties = () => {
    if (!entity.properties) return [];
    
    const priorityProperties = [
      'cpu_usage', 'memory_usage', 'response_time', 'network_connections',
      'active_requests', 'accuracy', 'confidence_score', 'latency',
      'bandwidth_usage', 'error_rate', 'severity', 'status',
      'session_duration', 'login_count', 'last_activity', 'failed_login_attempts',
      'permission_level', 'threat_score', 'detection_count'
    ];

    return Object.entries(entity.properties)
      .filter(([key]) => priorityProperties.includes(key))
      .slice(0, 3);
  };

  const formatPropertyValue = (propertyName: string, value: any) => {
    if (typeof value === 'number') {
      const unit = getUnit(propertyName);
      return `${value.toFixed(1)}${unit}`;
    }
    return formatText(String(value));
  };

  const keyProperties = getKeyProperties();

  return (
    <div className="px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-2 h-2 rounded-full ${getEntityTypeColor(entity.type)}`}
          />
          <div>
            <h4 className="text-sm font-medium text-white">{entity.name}</h4>
            <p className="text-xs text-gray-400">{formatEntityType(entity.type)}</p>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {keyProperties.map(([propertyName, property]) => (
              <div key={propertyName} className="bg-gradient-to-br from-gray-700/80 to-gray-800/90 border-l-4 border-blue-400/60 rounded-r-lg px-3 py-2 w-24 h-16 text-center shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-center backdrop-blur-sm">
                <div className="text-xs text-blue-300 font-medium">
                  {formatText(propertyName)}
                </div>
                <div className="text-xs text-white font-semibold mt-1">
                  {formatPropertyValue(propertyName, property.currentValue)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-white">
              {entity.changesToday} changes today
            </p>
            <p className="text-xs text-gray-400">
              Last seen: {formatTime(entity.lastSeen)}
            </p>
          </div>
          <div className="w-4 h-4"></div>
        </div>
      </div>
    </div>
  );
};
