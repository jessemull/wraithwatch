import React from 'react';

interface ControlPanelProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  onRotateLeft,
  onRotateRight,
}) => {
  return (
    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white">
      <div className="text-sm font-medium mb-2">3D Controls</div>
      <div className="flex flex-col gap-2">
        <button
          onClick={onZoomIn}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
        >
          Zoom In
        </button>
        <button
          onClick={onZoomOut}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
        >
          Zoom Out
        </button>
        <button
          onClick={onReset}
          className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-xs"
        >
          Reset View
        </button>
        {(onRotateLeft || onRotateRight) && (
          <div className="flex gap-1">
            {onRotateLeft && (
              <button
                onClick={onRotateLeft}
                className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
              >
                ↶
              </button>
            )}
            {onRotateRight && (
              <button
                onClick={onRotateRight}
                className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
              >
                ↷
              </button>
            )}
          </div>
        )}
      </div>
      <div className="text-xs text-gray-400 mt-2">
        Mouse wheel: Zoom
        <br />
        Left drag: Rotate
        <br />
        Right drag: Pan
      </div>
    </div>
  );
};
