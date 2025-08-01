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
    <div className="px-6 py-4 border-b border-gray-800">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">
            3D Entity Visualization
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {entitiesCount} Entities, {changesCount} Changes
          </p>
        </div>
        <div className="flex space-x-2">
          {visualizationTypes.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => onVisualizationTypeChange(type)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
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
