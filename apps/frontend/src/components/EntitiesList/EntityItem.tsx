import React from 'react';
import { EntityItemProps } from '../../types/entity';
import { getEntityTypeColor, formatTime } from '../../util/entity';

export const EntityItem: React.FC<EntityItemProps> = ({ entity }) => (
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
