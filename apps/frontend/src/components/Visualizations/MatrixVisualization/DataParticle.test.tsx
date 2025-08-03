import React from 'react';
import { render } from '@testing-library/react';
import { DataParticle } from './DataParticle';

describe('DataParticle', () => {
  it('renders without crashing (ambient)', () => {
    const { container } = render(<DataParticle position={[0, 0, 0]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders without crashing (threat)', () => {
    const { container } = render(
      <DataParticle position={[1, 2, 3]} type="threat" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
