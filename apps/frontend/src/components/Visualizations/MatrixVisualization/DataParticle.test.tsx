import React from 'react';
import { render } from '@testing-library/react';
import { DataParticle } from './DataParticle';

describe('DataParticle', () => {
  it('renders mesh at the given position (ambient)', () => {
    const { container } = render(<DataParticle position={[0, 0, 0]} />);
    expect(container.querySelector('mesh')).toBeInTheDocument();
    expect(container.querySelector('sphereGeometry')).toBeInTheDocument();
    expect(container.querySelector('meshStandardMaterial')).toBeInTheDocument();
  });

  it('renders mesh at the given position (threat)', () => {
    const { container } = render(
      <DataParticle position={[1, 2, 3]} type="threat" />
    );
    expect(container.querySelector('mesh')).toBeInTheDocument();
    expect(container.querySelector('sphereGeometry')).toBeInTheDocument();
    expect(container.querySelector('meshStandardMaterial')).toBeInTheDocument();
  });
});
