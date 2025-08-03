import React from 'react';
import { render } from '@testing-library/react';
import { ChangeParticle } from '../ChangeParticle';

describe('ChangeParticle (TimelineVisualization)', () => {
  it('renders mesh at the given position', () => {
    const { container } = render(<ChangeParticle position={[4, 5, 6]} />);
    // Should render a mesh element
    expect(container.querySelector('mesh')).toBeInTheDocument();
    // Should render a sphereGeometry element
    expect(container.querySelector('sphereGeometry')).toBeInTheDocument();
    // Should render a meshStandardMaterial element
    expect(container.querySelector('meshStandardMaterial')).toBeInTheDocument();
  });
});
