import React, { useState } from 'react';
import { EntityItemProps } from '../../types/entity';
import { getEntityTypeColor, formatTime, formatEntityType } from '../../util/entity';

export const EntityItem: React.FC<EntityItemProps> = ({ entity }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="px-6 py-3 hover:bg-gray-600/50 cursor-pointer transition-colors duration-200">
      <div 
        className="flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`w-2 h-2 rounded-full ${getEntityTypeColor(entity.type)}`}
          />
          <div>
            <h4 className="text-sm font-medium text-white">{entity.name}</h4>
            <p className="text-xs text-gray-400">{formatEntityType(entity.type)}</p>
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

      {isExpanded && entity.properties && (
        <div className="mt-3 pt-3 border-t border-gray-600">
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(entity.properties).map(([propertyName, property]) => (
              <div key={propertyName} className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-medium text-gray-300 capitalize">
                    {propertyName.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-gray-400">
                    {property.lastChanged ? formatTime(property.lastChanged) : 'N/A'}
                  </span>
                </div>
                <div className="text-sm text-white font-mono">
                  {typeof property.currentValue === 'number' 
                    ? property.currentValue.toFixed(2)
                    : property.currentValue}
                </div>
                {property.history && property.history.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-400 mb-1">History:</div>
                    <div className="space-y-1">
                                             {property.history.slice(-3).reverse().map((change, index) => (
                         <div key={index} className="text-xs text-gray-500">
                           {change.timestamp ? formatTime(change.timestamp) : 'N/A'}: {change.newValue}
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
