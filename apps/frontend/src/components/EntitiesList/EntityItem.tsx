import React from 'react';
import { EntityItemProps } from '../../types/entity';
import {
  getEntityTypeColor,
  formatTime,
  formatEntityType,
  getUnit,
  formatText,
  getEntityName,
} from '../../util/entity';

export const EntityItem: React.FC<EntityItemProps> = ({ entity }) => {
  const getKeyProperties = () => {
    if (!entity.properties) return [];

    // Define priority properties based on entity type...

    let priorityProperties: string[];

    if (entity.type === 'AI_Agent') {
      priorityProperties = [
        'status',
        'confidence_score',
        'active_requests',
        'response_time',
        'accuracy',
        'training_status',
      ];
    } else if (entity.type === 'Network_Node') {
      priorityProperties = [
        'routing_status',
        'bandwidth_usage',
        'connection_count',
        'latency',
        'error_rate',
        'packet_loss',
      ];
    } else if (entity.type === 'Threat') {
      priorityProperties = [
        'severity',
        'threat_score',
        'detection_count',
        'mitigation_status',
        'attack_type',
      ];
    } else if (entity.type === 'System') {
      priorityProperties = [
        'status',
        'cpu_usage',
        'memory_usage',
        'response_time',
        'network_connections',
        'disk_usage',
      ];
    } else if (entity.type === 'User') {
      priorityProperties = [
        'last_activity',
        'login_count',
        'session_duration',
        'permission_level',
        'failed_login_attempts',
      ];
    } else {
      priorityProperties = [
        'cpu_usage',
        'memory_usage',
        'response_time',
        'network_connections',
        'active_requests',
        'accuracy',
        'confidence_score',
        'latency',
        'bandwidth_usage',
        'error_rate',
        'severity',
        'status',
        'session_duration',
        'login_count',
        'last_activity',
        'failed_login_attempts',
        'permission_level',
        'threat_score',
        'detection_count',
      ];
    }

    const filteredProperties = Object.entries(entity.properties).filter(
      ([key]) => priorityProperties.includes(key)
    );

    const sortedProperties = filteredProperties.sort(([a], [b]) => {
      return a.localeCompare(b);
    });

    return sortedProperties.slice(0, 5);
  };

  const formatPropertyValue = (
    propertyName: string,
    value: string | number
  ) => {
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
          <div className="min-w-[165px]">
            <h4 className="text-sm font-medium text-white">
              {getEntityName(entity.id)}
            </h4>
            <p className="text-xs text-gray-400">
              {formatEntityType(entity.type)}
            </p>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {keyProperties.map(([propertyName, property]) => (
              <div
                key={propertyName}
                className="bg-gradient-to-br from-gray-700/80 to-gray-800/90 border-l-4 border-blue-400/60 rounded-r-lg px-3 py-2 w-24 h-16 text-center shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-center backdrop-blur-sm"
              >
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
