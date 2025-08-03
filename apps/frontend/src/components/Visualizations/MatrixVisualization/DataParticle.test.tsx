import React from 'react';
import { render } from '@testing-library/react';
import { DataParticle } from './DataParticle';
describe('DataParticle', () => {
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
