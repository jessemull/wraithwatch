import React from 'react';
import { render } from '@testing-library/react';
import { ChangeParticle } from '../ChangeParticle';
describe('ChangeParticle (NetworkVisualization)', () => {
  let originalError: typeof console.error;
  let originalWarn: typeof console.warn;

  beforeAll(() => {
    originalError = console.error;
    originalWarn = console.warn;
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
  });
  it('renders without crashing', () => {
    const { container } = render(
      <ChangeParticle position={[1, 2, 3]} change={{} as any} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
