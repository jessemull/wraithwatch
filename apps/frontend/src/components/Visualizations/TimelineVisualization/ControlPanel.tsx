import React, { useMemo } from 'react';
import { CONTROL_PANEL_CONFIG } from '../../../constants/visualization';
import { ControlButton } from '../../../types/visualization';

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
      },
      {
        label: 'Zoom Out',
        onClick: onZoomOut,
        className: CONTROL_PANEL_CONFIG.buttonClasses.zoom,
      },
      {
        label: 'Reset View',
        onClick: onReset,
        className: CONTROL_PANEL_CONFIG.buttonClasses.reset,
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

  const helpText = useMemo(() => CONTROL_PANEL_CONFIG.helpText, []);

  return (
    <div
      className={`${CONTROL_PANEL_CONFIG.position} ${CONTROL_PANEL_CONFIG.styling}`}
    >
      <div className="text-sm font-medium mb-2">3D Controls</div>
      <div className="flex flex-col gap-2">
        {controlButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className={button.className}
            aria-label={button.label}
            title={button.label}
          >
            {button.icon ? button.icon : button.label}
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-400 mt-2">
        {helpText.map((text, index) => (
          <div key={index}>{text}</div>
        ))}
      </div>
    </div>
  );
};
