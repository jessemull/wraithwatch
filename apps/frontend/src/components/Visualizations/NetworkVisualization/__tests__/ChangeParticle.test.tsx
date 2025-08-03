import React from 'react';
import { render } from '@testing-library/react';
import { ChangeParticle } from '../ChangeParticle';

describe('ChangeParticle (NetworkVisualization)', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ChangeParticle position={[1, 2, 3]} change={{} as any} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
