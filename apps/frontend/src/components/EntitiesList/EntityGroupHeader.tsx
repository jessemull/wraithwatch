import React from 'react';
import { EntityGroupHeaderProps } from '../../types/entity';
import {
  getEntityTypeColor,
  formatTime,
  formatEntityType,
} from '../../util/entity';

export const EntityGroupHeader: React.FC<EntityGroupHeaderProps> = ({
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
            {formatEntityType(type)}
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
