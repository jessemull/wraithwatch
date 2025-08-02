import React from 'react';
import { VisualizationType } from '../../types/visualization';
import { visualizationTypes } from '../../constants/visualization';

interface VisualizationControlsProps {
  visualizationType: VisualizationType;
  onVisualizationTypeChange: (type: VisualizationType) => void;
  entitiesCount: number;
  changesCount: number;
}

export const VisualizationControls: React.FC<VisualizationControlsProps> = ({
  visualizationType,
  onVisualizationTypeChange,
  entitiesCount,
  changesCount,
}) => {
  return (
    <div className="px-4 sm:px-6 py-4 border-b border-gray-800">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-white truncate">
            3D Entity Visualization
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 truncate">
            {entitiesCount} Entities, {changesCount} Changes
          </p>
        </div>
        <div className="flex justify-start space-x-1 sm:space-x-2">
          {visualizationTypes.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => onVisualizationTypeChange(type)}
              className={`px-2 sm:px-4 py-2 rounded text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ${
                visualizationType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
