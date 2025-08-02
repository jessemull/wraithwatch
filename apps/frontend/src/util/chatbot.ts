import { Message, ChatMessage } from '../types/chatbot';

/**
 * Formats message history for API consumption
 * Takes the last 5 messages and converts them to the API format
 * @param messages - Array of messages to format
 * @returns Formatted messages for API
 */
export function formatHistoryForAPI(messages: Message[]): ChatMessage[] {
  return messages.slice(-5).map(msg => ({
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp.toISOString(),
  }));
}

/**
 * Scrolls an element into view with smooth behavior
 * @param element - The element to scroll to
 */
export function scrollToBottom(element: HTMLElement | null): void {
  element?.scrollIntoView({ behavior: 'smooth' });
}
