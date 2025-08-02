import { ChatMessage } from "../types";
import { MAX_HISTORY_LENGTH } from "../constants";

/**
 * Limits the conversation history to the specified maximum length
 * Keeps the most recent messages
 */
export function limitHistoryLength(history: ChatMessage[] = []): ChatMessage[] {
  return history.slice(-MAX_HISTORY_LENGTH);
}

/**
 * Builds a new conversation history by adding user and assistant messages
 * and limiting to the maximum length
 */
export function buildConversationHistory(
  existingHistory: ChatMessage[] = [],
  userMessage: string,
  assistantMessage: string,
): ChatMessage[] {
  const userMessageObj: ChatMessage = {
    role: "user",
    content: userMessage,
    timestamp: new Date().toISOString(),
  };

  const assistantMessageObj: ChatMessage = {
    role: "assistant",
    content: assistantMessage,
    timestamp: new Date().toISOString(),
  };

  const updatedHistory = [
    ...existingHistory,
    userMessageObj,
    assistantMessageObj,
  ];
  return limitHistoryLength(updatedHistory);
}

/**
 * Converts ChatMessage array to Claude API format
 */
export function convertToClaudeFormat(
  history: ChatMessage[] = [],
): Array<{ role: "user" | "assistant"; content: string }> {
  return history.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
}
