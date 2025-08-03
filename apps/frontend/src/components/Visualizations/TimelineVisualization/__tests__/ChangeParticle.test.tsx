import React from 'react';
import { render } from '@testing-library/react';
import { ChangeParticle } from '../ChangeParticle';

describe('ChangeParticle (TimelineVisualization)', () => {
  it('renders without crashing', () => {
    const { container } = render(<ChangeParticle position={[4, 5, 6]} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
