import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ControlPanel } from '../ControlPanel';
jest.mock('../../../../constants/visualization', () => ({
  CONTROL_PANEL_CONFIG: {
    position: 'absolute top-4 right-4',
    styling: 'z-10',
    buttonClasses: {
      zoom: 'zoom-button-class',
      reset: 'reset-button-class',
      rotate: 'rotate-button-class',
    },
  },
}));
describe('ControlPanel', () => {
  const mockProps = {
    onZoomIn: jest.fn(),
    onZoomOut: jest.fn(),
    onReset: jest.fn(),
  };
  it('renders control panel with basic buttons', () => {
    render(<ControlPanel {...mockProps} />);
    expect(screen.getByLabelText('Zoom In')).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom Out')).toBeInTheDocument();
    expect(screen.getByLabelText('Reset View')).toBeInTheDocument();
  });
  it('calls onZoomIn when zoom in button is clicked', () => {
    render(<ControlPanel {...mockProps} />);
    fireEvent.click(screen.getByLabelText('Zoom In'));
    expect(mockProps.onZoomIn).toHaveBeenCalled();
  });
  it('calls onZoomOut when zoom out button is clicked', () => {
    render(<ControlPanel {...mockProps} />);
    fireEvent.click(screen.getByLabelText('Zoom Out'));
    expect(mockProps.onZoomOut).toHaveBeenCalled();
  });
  it('calls onReset when reset button is clicked', () => {
    render(<ControlPanel {...mockProps} />);
    fireEvent.click(screen.getByLabelText('Reset View'));
    expect(mockProps.onReset).toHaveBeenCalled();
  });
  it('renders rotation buttons when provided', () => {
    const propsWithRotation = {
      ...mockProps,
      onRotateLeft: jest.fn(),
      onRotateRight: jest.fn(),
    };
    render(<ControlPanel {...propsWithRotation} />);
    expect(screen.getByLabelText('Rotate Left')).toBeInTheDocument();
    expect(screen.getByLabelText('Rotate Right')).toBeInTheDocument();
  });
});
