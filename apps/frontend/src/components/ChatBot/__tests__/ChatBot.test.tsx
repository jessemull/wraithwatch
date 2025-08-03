import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatBot from '../ChatBot';

// Mock the fetch API
global.fetch = jest.fn();

// Mock the util functions
jest.mock('../../../util/chatbot', () => ({
  formatHistoryForAPI: jest.fn(() => []),
  scrollToBottom: jest.fn(),
}));

describe('ChatBot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders chat button when closed', () => {
    render(<ChatBot />);

    expect(screen.getByLabelText('Open chat with Nazgul')).toBeInTheDocument();
    expect(screen.queryByText('Chat with Nazgul')).not.toBeInTheDocument();
  });

  it('opens chat when button is clicked', async () => {
    const user = userEvent.setup();
    render(<ChatBot />);

    const chatButton = screen.getByLabelText('Open chat with Nazgul');
    await user.click(chatButton);

    expect(screen.getByText('Chat with Nazgul')).toBeInTheDocument();
    expect(
      screen.getByText("Hello! I'm Nazgul, your security assistant.")
    ).toBeInTheDocument();
  });

  it('closes chat when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<ChatBot />);

    // Open chat
    const chatButton = screen.getByLabelText('Open chat with Nazgul');
    await user.click(chatButton);

    // Close chat - find the close button by its class
    const buttons = screen.getAllByRole('button');
    const closeButton = buttons.find(button =>
      button.className.includes('text-gray-300 hover:text-white')
    );
    await user.click(closeButton!);

    expect(screen.queryByText('Chat with Nazgul')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Open chat with Nazgul')).toBeInTheDocument();
  });

  it('allows typing in input field', async () => {
    const user = userEvent.setup();
    render(<ChatBot />);

    // Open chat
    const chatButton = screen.getByLabelText('Open chat with Nazgul');
    await user.click(chatButton);

    const input = screen.getByPlaceholderText('Type your message...');
    await user.type(input, 'Hello, Nazgul!');

    expect(input).toHaveValue('Hello, Nazgul!');
  });

  it('sends message when send button is clicked', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Hello! How can I help you with security?',
        timestamp: new Date().toISOString(),
      }),
    });

    render(<ChatBot />);

    // Open chat
    const chatButton = screen.getByLabelText('Open chat with Nazgul');
    await user.click(chatButton);

    // Type and send message
    const input = screen.getByPlaceholderText('Type your message...');
    await user.type(input, 'Hello');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(input).toHaveValue('');
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('sends message when Enter key is pressed', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Hello! How can I help you with security?',
        timestamp: new Date().toISOString(),
      }),
    });

    render(<ChatBot />);

    // Open chat
    const chatButton = screen.getByLabelText('Open chat with Nazgul');
    await user.click(chatButton);

    // Type and press Enter
    const input = screen.getByPlaceholderText('Type your message...');
    await user.type(input, 'Hello{enter}');

    expect(input).toHaveValue('');
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('does not send empty messages', async () => {
    const user = userEvent.setup();
    render(<ChatBot />);

    // Open chat
    const chatButton = screen.getByLabelText('Open chat with Nazgul');
    await user.click(chatButton);

    const sendButton = screen.getByRole('button', { name: 'Send' });
    expect(sendButton).toBeDisabled();

    await user.click(sendButton);
    // Should not have sent any message
    expect(
      screen.queryByText("Hello! I'm Nazgul, your security assistant.")
    ).toBeInTheDocument();
  });

  it('shows loading state while sending message', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<ChatBot />);

    // Open chat
    const chatButton = screen.getByLabelText('Open chat with Nazgul');
    await user.click(chatButton);

    // Type and send message
    const input = screen.getByPlaceholderText('Type your message...');
    await user.type(input, 'Hello');
    await user.click(screen.getByText('Send'));

    expect(screen.getByText('Nazgul is analyzing...')).toBeInTheDocument();
    expect(input).toBeDisabled();
    expect(screen.getByText('Send')).toBeDisabled();
  });

  it('handles successful API response', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      message: 'Hello! How can I help you with security?',
      timestamp: new Date().toISOString(),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<ChatBot />);

    // Open chat
    const chatButton = screen.getByLabelText('Open chat with Nazgul');
    await user.click(chatButton);

    // Type and send message
    const input = screen.getByPlaceholderText('Type your message...');
    await user.type(input, 'Hello');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => {
      expect(
        screen.getByText('Hello! How can I help you with security?')
      ).toBeInTheDocument();
    });
  });

  it('handles API error response', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ error: 'Server error' }),
    });

    render(<ChatBot />);

    // Open chat
    const chatButton = screen.getByLabelText('Open chat with Nazgul');
    await user.click(chatButton);

    // Type and send message
    const input = screen.getByPlaceholderText('Type your message...');
    await user.type(input, 'Hello');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => {
      expect(
        screen.getByText(/Sorry, I ran into an issue/)
      ).toBeInTheDocument();
    });
  });

  it('handles network error', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    render(<ChatBot />);

    // Open chat
    const chatButton = screen.getByLabelText('Open chat with Nazgul');
    await user.click(chatButton);

    // Type and send message
    const input = screen.getByPlaceholderText('Type your message...');
    await user.type(input, 'Hello');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => {
      expect(
        screen.getByText(/Sorry, I ran into an issue/)
      ).toBeInTheDocument();
    });
  });

  it('disables input and send button while loading', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<ChatBot />);

    // Open chat
    const chatButton = screen.getByLabelText('Open chat with Nazgul');
    await user.click(chatButton);

    // Type and send message
    const input = screen.getByPlaceholderText('Type your message...');
    await user.type(input, 'Hello');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(input).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });

  it('displays message timestamps', async () => {
    const user = userEvent.setup();
    render(<ChatBot />);

    // Open chat
    const chatButton = screen.getByLabelText('Open chat with Nazgul');
    await user.click(chatButton);

    // Type and send message
    const input = screen.getByPlaceholderText('Type your message...');
    await user.type(input, 'Hello');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    // Check that timestamp is displayed
    const timestamps = screen.getAllByText(/\d{1,2}:\d{2}/);
    expect(timestamps.length).toBeGreaterThan(0);
  });
});
