import React, { useMemo } from 'react';
import { CONTROL_PANEL_CONFIG } from '../../../constants/visualization';
import { ControlButton } from '../../../types/visualization';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

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
  const controlButtons = useMemo((): ControlButton[] => {
    const buttons: ControlButton[] = [
      {
        label: 'Zoom In',
        onClick: onZoomIn,
        className: CONTROL_PANEL_CONFIG.buttonClasses.zoom,
        icon: <ZoomIn size={20} />,
      },
      {
        label: 'Zoom Out',
        onClick: onZoomOut,
        className: CONTROL_PANEL_CONFIG.buttonClasses.zoom,
        icon: <ZoomOut size={20} />,
      },
      {
        label: 'Reset View',
        onClick: onReset,
        className: CONTROL_PANEL_CONFIG.buttonClasses.reset,
        icon: <RotateCcw size={20} />,
      },
    ];

    if (onRotateLeft) {
      buttons.push({
        label: 'Rotate Left',
        onClick: onRotateLeft,
        className: CONTROL_PANEL_CONFIG.buttonClasses.rotate,
        icon: '↶',
      });
    }

    if (onRotateRight) {
      buttons.push({
        label: 'Rotate Right',
        onClick: onRotateRight,
        className: CONTROL_PANEL_CONFIG.buttonClasses.rotate,
        icon: '↷',
      });
    }

    return buttons;
  }, [onZoomIn, onZoomOut, onReset, onRotateLeft, onRotateRight]);

  return (
    <div
      className={`${CONTROL_PANEL_CONFIG.position} ${CONTROL_PANEL_CONFIG.styling}`}
    >
      <div className="flex flex-col gap-2">
        {controlButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-2 hover:bg-gray-800/50 transition-colors cursor-pointer"
            aria-label={button.label}
            title={button.label}
          >
            {button.icon}
          </button>
        ))}
      </div>
    </div>
  );
};
