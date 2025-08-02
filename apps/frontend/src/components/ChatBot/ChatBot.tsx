'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Message,
  ChatRequest,
  ChatResponse,
  ErrorResponse,
} from '../../types/chatbot';
import { formatHistoryForAPI, scrollToBottom } from '../../util/chatbot';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom(messagesEndRef.current);
      setShouldScrollToBottom(false);
    }
  }, [messages, shouldScrollToBottom]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShouldScrollToBottom(true);
    setIsLoading(true);

    try {
      const requestBody: ChatRequest = {
        message: userMessage.content,
        history: formatHistoryForAPI(messages),
      };

      const response = await fetch(
        'https://api.chat.wraithwatch-demo.com/api/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Origin: 'https://www.wraithwatch-demo.com',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data: ChatResponse = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(data.timestamp),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          error instanceof Error
            ? `Sorry, I ran into an issue: ${error.message}`
            : 'Sorry, I seem to be having some technical difficulties. Please try again!',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open chat with Nazgul"
          className="bg-gray-900 border-2 border-white rounded-full p-4 shadow-lg hover:bg-gray-800 transition-colors duration-200"
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>
      )}
      {isOpen && (
        <div className="bg-gray-900 border-2 border-white rounded-lg shadow-lg w-[calc(100vw-2rem)] md:w-80 h-[calc(100vh-2rem)] max-h-96 md:h-96 flex flex-col fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:static md:transform-none">
          <div className="p-4 border-b border-white flex justify-between items-center">
            <h3 className="text-white font-semibold">Chat with Nazgul</h3>
            <button
              onClick={() => {
                setIsOpen(false);
                setMessages([]);
                setInput('');
              }}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm">
                <p>Hello! I&apos;m Nazgul, your security assistant.</p>
                <p className="mt-2">
                  Ask me about the dashboard or cybersecurity.
                </p>
              </div>
            )}
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-white text-gray-900'
                      : 'bg-gray-800 text-gray-100 border border-gray-700'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-100 p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                    <span className="text-sm">Nazgul is analyzing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-white">
            <div className="flex space-x-2 items-center">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-white focus:outline-none disabled:opacity-50 text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-white text-gray-900 px-4 py-2 rounded hover:bg-gray-100 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
