import { formatHistoryForAPI, scrollToBottom } from '../chatbot';
import { Message } from '../../types/chatbot';

describe('ChatBot Utility Functions', () => {
  describe('formatHistoryForAPI', () => {
    const mockMessages: Message[] = [
      {
        id: '1',
        role: 'user',
        content: 'Hello',
        timestamp: new Date('2023-01-01T10:00:00Z'),
      },
      {
        id: '2',
        role: 'assistant',
        content: 'Hi there!',
        timestamp: new Date('2023-01-01T10:01:00Z'),
      },
      {
        id: '3',
        role: 'user',
        content: 'How are you?',
        timestamp: new Date('2023-01-01T10:02:00Z'),
      },
      {
        id: '4',
        role: 'assistant',
        content: "I'm doing well!",
        timestamp: new Date('2023-01-01T10:03:00Z'),
      },
      {
        id: '5',
        role: 'user',
        content: "What's the weather?",
        timestamp: new Date('2023-01-01T10:04:00Z'),
      },
      {
        id: '6',
        role: 'assistant',
        content: "I can't check the weather.",
        timestamp: new Date('2023-01-01T10:05:00Z'),
      },
      {
        id: '7',
        role: 'user',
        content: 'Thanks!',
        timestamp: new Date('2023-01-01T10:06:00Z'),
      },
    ];

    it('takes the last 5 messages from the array', () => {
      const result = formatHistoryForAPI(mockMessages);

      expect(result).toHaveLength(5);
      expect(result[0].content).toBe('How are you?');
      expect(result[1].content).toBe("I'm doing well!");
      expect(result[2].content).toBe("What's the weather?");
      expect(result[3].content).toBe("I can't check the weather.");
      expect(result[4].content).toBe('Thanks!');
    });

    it('converts messages to API format', () => {
      const result = formatHistoryForAPI(mockMessages);

      expect(result[0]).toEqual({
        role: 'user',
        content: 'How are you?',
        timestamp: '2023-01-01T10:02:00.000Z',
      });
    });

    it('handles arrays with fewer than 5 messages', () => {
      const shortMessages = mockMessages.slice(0, 3);
      const result = formatHistoryForAPI(shortMessages);

      expect(result).toHaveLength(3);
      expect(result[0].content).toBe('Hello');
      expect(result[1].content).toBe('Hi there!');
      expect(result[2].content).toBe('How are you?');
    });

    it('handles empty array', () => {
      const result = formatHistoryForAPI([]);

      expect(result).toHaveLength(0);
    });

    it('preserves role and content in conversion', () => {
      const result = formatHistoryForAPI(mockMessages);

      result.forEach(message => {
        expect(message).toHaveProperty('role');
        expect(message).toHaveProperty('content');
        expect(message).toHaveProperty('timestamp');
        expect(typeof message.timestamp).toBe('string');
      });
    });
  });

  describe('scrollToBottom', () => {
    let mockElement: HTMLElement;
    let mockScrollIntoView: jest.Mock;

    beforeEach(() => {
      mockScrollIntoView = jest.fn();
      mockElement = {
        scrollIntoView: mockScrollIntoView,
      } as unknown as HTMLElement;
    });

    it('calls scrollIntoView with smooth behavior when element exists', () => {
      scrollToBottom(mockElement);

      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('does not throw error when element is null', () => {
      expect(() => scrollToBottom(null)).not.toThrow();
    });

    it('does not call scrollIntoView when element is null', () => {
      scrollToBottom(null);

      expect(mockScrollIntoView).not.toHaveBeenCalled();
    });
  });
});
