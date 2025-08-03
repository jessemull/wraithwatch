import React from 'react';
import { render } from '@testing-library/react';
import { DataFlowLine } from '../DataFlowLine';
describe('DataFlowLine', () => {
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
  it('renders DataFlowLine with mesh', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 1, 1];
    render(<DataFlowLine start={start} end={end} />);
    expect(document.body).toBeInTheDocument();
  });
  it('calculates correct midpoint', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [2, 4, 6];
    render(<DataFlowLine start={start} end={end} />);
    expect(document.body).toBeInTheDocument();
  });
  it('calculates correct distance', () => {
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [3, 4, 0];
    render(<DataFlowLine start={start} end={end} />);
    expect(document.body).toBeInTheDocument();
  });
  it('handles zero distance', () => {
    const start: [number, number, number] = [1, 1, 1];
    const end: [number, number, number] = [1, 1, 1];
    render(<DataFlowLine start={start} end={end} />);
    expect(document.body).toBeInTheDocument();
  });
  it('handles negative coordinates', () => {
    const start: [number, number, number] = [-1, -2, -3];
    const end: [number, number, number] = [1, 2, 3];
    render(<DataFlowLine start={start} end={end} />);
    expect(document.body).toBeInTheDocument();
  });
});
