import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { VisualizationControls } from '../Dashboard/VisualizationControls';

// Mock the constants
jest.mock('../../constants/visualization', () => ({
  visualizationTypes: [
    { type: 'timeline', label: 'Timeline' },
    { type: 'network', label: 'Network' },
    { type: 'matrix', label: 'Matrix' },
  ],
}));

describe('VisualizationControls', () => {
  const mockProps = {
    visualizationType: 'timeline' as const,
    onVisualizationTypeChange: jest.fn(),
    entitiesCount: 5,
    changesCount: 10,
  };

  it('renders visualization controls', () => {
    render(<VisualizationControls {...mockProps} />);
    
    expect(screen.getByText('3D Entity Visualization')).toBeInTheDocument();
    expect(screen.getByText('5 Entities, 10 Changes')).toBeInTheDocument();
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('Network')).toBeInTheDocument();
    expect(screen.getByText('Matrix')).toBeInTheDocument();
  });

  it('calls onVisualizationTypeChange when button is clicked', () => {
    render(<VisualizationControls {...mockProps} />);
    
    fireEvent.click(screen.getByText('Network'));
    
    expect(mockProps.onVisualizationTypeChange).toHaveBeenCalledWith('network');
  });

  it('highlights the active visualization type', () => {
    render(<VisualizationControls {...mockProps} />);
    
    const timelineButton = screen.getByText('Timeline');
    expect(timelineButton).toHaveClass('bg-blue-600');
  });
}); 