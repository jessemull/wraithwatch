import React from 'react';
import { render, screen } from '@testing-library/react';
import { WelcomeSection } from '../WelcomeSection';

describe('WelcomeSection', () => {
  it('renders welcome message with default user name', () => {
    render(<WelcomeSection />);
    expect(screen.getByText('Welcome back, Nik!')).toBeInTheDocument();
  });

  it('renders welcome message with custom user name', () => {
    render(<WelcomeSection userName="John" />);
    expect(screen.getByText('Welcome back, John!')).toBeInTheDocument();
  });

  it('renders welcome message with empty user name', () => {
    render(<WelcomeSection userName="" />);
    expect(screen.getByText('Welcome back, !')).toBeInTheDocument();
  });

  it('renders welcome message with undefined user name', () => {
    render(<WelcomeSection userName={undefined} />);
    expect(screen.getByText('Welcome back, Nik!')).toBeInTheDocument();
  });

  it('renders suspicious login alert', () => {
    render(<WelcomeSection />);
    expect(screen.getByText('Suspicious login - 2m ago')).toBeInTheDocument();
  });

  it('renders network activity alert', () => {
    render(<WelcomeSection />);
    expect(screen.getByText('Network activity - 15m ago')).toBeInTheDocument();
  });

  it('renders status indicators', () => {
    render(<WelcomeSection />);
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Secure')).toBeInTheDocument();
  });

  it('renders dashboard connection status', () => {
    render(<WelcomeSection />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  it('renders alert indicators with correct colors', () => {
    render(<WelcomeSection />);

    const redIndicator = document.querySelector('.bg-red-500');
    const yellowIndicator = document.querySelector('.bg-yellow-500');

    expect(redIndicator).toBeInTheDocument();
    expect(yellowIndicator).toBeInTheDocument();
  });

  it('renders status indicators with correct colors', () => {
    render(<WelcomeSection />);

    const secureStatus = screen.getByText('Secure');
    const connectedStatus = screen.getByText('Connected');

    expect(secureStatus).toHaveClass('text-green-400');
    expect(connectedStatus).toHaveClass('text-green-400');
  });

  it('renders divider between status indicators', () => {
    render(<WelcomeSection />);

    const divider = document.querySelector('.w-px.h-8.bg-gray-600');
    expect(divider).toBeInTheDocument();
  });

  it('renders with correct layout structure', () => {
    render(<WelcomeSection />);

    const mainContainer = screen
      .getByText('Welcome back, Nik!')
      .closest('.mb-10');
    expect(mainContainer).toBeInTheDocument();

    const flexContainer = mainContainer?.querySelector(
      '.flex.flex-col.items-center.sm\\:flex-row'
    );
    expect(flexContainer).toBeInTheDocument();
  });

  it('renders responsive layout elements', () => {
    render(<WelcomeSection />);

    const textContainer = screen
      .getByText('Welcome back, Nik!')
      .closest('.text-center.sm\\:text-left');
    expect(textContainer).toBeInTheDocument();

    const statusContainer = screen
      .getByText('Status')
      .closest('.flex.items-center.justify-center.sm\\:justify-end');
    expect(statusContainer).toBeInTheDocument();
  });

  it('renders alert items with correct spacing', () => {
    render(<WelcomeSection />);

    const alertContainer = screen
      .getByText('Suspicious login - 2m ago')
      .closest('.flex.flex-col.items-center.space-y-2.sm\\:flex-row');
    expect(alertContainer).toBeInTheDocument();
  });

  it('renders all required elements', () => {
    render(<WelcomeSection />);

    // Main welcome text
    expect(screen.getByText(/Welcome back/)).toBeInTheDocument();

    // Alert messages
    expect(screen.getByText(/Suspicious login/)).toBeInTheDocument();
    expect(screen.getByText(/Network activity/)).toBeInTheDocument();

    // Status labels
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();

    // Status values
    expect(screen.getByText('Secure')).toBeInTheDocument();
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  it('handles different user name types', () => {
    const { rerender } = render(<WelcomeSection userName="Alice" />);
    expect(screen.getByText('Welcome back, Alice!')).toBeInTheDocument();

    rerender(<WelcomeSection userName="Bob" />);
    expect(screen.getByText('Welcome back, Bob!')).toBeInTheDocument();

    rerender(<WelcomeSection userName="Charlie" />);
    expect(screen.getByText('Welcome back, Charlie!')).toBeInTheDocument();
  });

  it('maintains consistent structure across renders', () => {
    const { rerender } = render(<WelcomeSection />);
    const initialStructure = document.querySelector('.mb-10');

    rerender(<WelcomeSection userName="Test" />);
    const updatedStructure = document.querySelector('.mb-10');

    expect(initialStructure).toBeInTheDocument();
    expect(updatedStructure).toBeInTheDocument();
  });
});
