import {
  limitHistoryLength,
  buildConversationHistory,
  convertToClaudeFormat,
} from "./history";
import { ChatMessage } from "../types";
import { MAX_HISTORY_LENGTH } from "../constants";

describe("History Service", () => {
  describe("limitHistoryLength", () => {
    it("should return empty array for undefined input", () => {
      const result = limitHistoryLength(undefined);
      expect(result).toEqual([]);
    });

    it("should return empty array for empty input", () => {
      const result = limitHistoryLength([]);
      expect(result).toEqual([]);
    });

    it("should return all messages when under limit", () => {
      const history: ChatMessage[] = [
        { role: "user", content: "Hello", timestamp: "2023-01-01T00:00:00Z" },
        {
          role: "assistant",
          content: "Hi there!",
          timestamp: "2023-01-01T00:00:01Z",
        },
      ];
      const result = limitHistoryLength(history);
      expect(result).toEqual(history);
    });

    it("should limit to last 5 messages when over limit", () => {
      const history: ChatMessage[] = [
        {
          role: "user",
          content: "Message 1",
          timestamp: "2023-01-01T00:00:00Z",
        },
        {
          role: "assistant",
          content: "Response 1",
          timestamp: "2023-01-01T00:00:01Z",
        },
        {
          role: "user",
          content: "Message 2",
          timestamp: "2023-01-01T00:00:02Z",
        },
        {
          role: "assistant",
          content: "Response 2",
          timestamp: "2023-01-01T00:00:03Z",
        },
        {
          role: "user",
          content: "Message 3",
          timestamp: "2023-01-01T00:00:04Z",
        },
        {
          role: "assistant",
          content: "Response 3",
          timestamp: "2023-01-01T00:00:05Z",
        },
        {
          role: "user",
          content: "Message 4",
          timestamp: "2023-01-01T00:00:06Z",
        },
        {
          role: "assistant",
          content: "Response 4",
          timestamp: "2023-01-01T00:00:07Z",
        },
      ];
      const result = limitHistoryLength(history);
      expect(result).toHaveLength(MAX_HISTORY_LENGTH);
      expect(result[0].content).toBe("Response 2");
      expect(result[4].content).toBe("Response 4");
    });
  });

  describe("buildConversationHistory", () => {
    it("should build history with empty existing history", () => {
      const result = buildConversationHistory([], "Hello", "Hi there!");

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        role: "user",
        content: "Hello",
        timestamp: expect.any(String),
      });
      expect(result[1]).toEqual({
        role: "assistant",
        content: "Hi there!",
        timestamp: expect.any(String),
      });
    });

    it("should build history with existing history", () => {
      const existingHistory: ChatMessage[] = [
        {
          role: "user",
          content: "Previous message",
          timestamp: "2023-01-01T00:00:00Z",
        },
        {
          role: "assistant",
          content: "Previous response",
          timestamp: "2023-01-01T00:00:01Z",
        },
      ];

      const result = buildConversationHistory(
        existingHistory,
        "New message",
        "New response",
      );

      expect(result).toHaveLength(4);
      expect(result[0].content).toBe("Previous message");
      expect(result[1].content).toBe("Previous response");
      expect(result[2].content).toBe("New message");
      expect(result[3].content).toBe("New response");
    });

    it("should limit history to maximum length", () => {
      const existingHistory: ChatMessage[] = [
        { role: "user", content: "Old 1", timestamp: "2023-01-01T00:00:00Z" },
        {
          role: "assistant",
          content: "Old 1 response",
          timestamp: "2023-01-01T00:00:01Z",
        },
        { role: "user", content: "Old 2", timestamp: "2023-01-01T00:00:02Z" },
        {
          role: "assistant",
          content: "Old 2 response",
          timestamp: "2023-01-01T00:00:03Z",
        },
        { role: "user", content: "Old 3", timestamp: "2023-01-01T00:00:04Z" },
        {
          role: "assistant",
          content: "Old 3 response",
          timestamp: "2023-01-01T00:00:05Z",
        },
      ];

      const result = buildConversationHistory(
        existingHistory,
        "New message",
        "New response",
      );

      expect(result).toHaveLength(MAX_HISTORY_LENGTH);
      expect(result[0].content).toBe("Old 2 response");
      expect(result[4].content).toBe("New response");
    });

    it("should handle undefined existing history", () => {
      const result = buildConversationHistory(undefined, "Hello", "Hi there!");

      expect(result).toHaveLength(2);
      expect(result[0].content).toBe("Hello");
      expect(result[1].content).toBe("Hi there!");
    });
  });

  describe("convertToClaudeFormat", () => {
    it("should convert empty history", () => {
      const result = convertToClaudeFormat([]);
      expect(result).toEqual([]);
    });

    it("should convert history to Claude format", () => {
      const history: ChatMessage[] = [
        { role: "user", content: "Hello", timestamp: "2023-01-01T00:00:00Z" },
        {
          role: "assistant",
          content: "Hi there!",
          timestamp: "2023-01-01T00:00:01Z",
        },
      ];

      const result = convertToClaudeFormat(history);

      expect(result).toEqual([
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi there!" },
      ]);
    });

    it("should handle undefined history", () => {
      const result = convertToClaudeFormat(undefined);
      expect(result).toEqual([]);
    });

    it("should preserve role and content but remove timestamp", () => {
      const history: ChatMessage[] = [
        {
          role: "user",
          content: "Test message",
          timestamp: "2023-01-01T00:00:00Z",
        },
      ];

      const result = convertToClaudeFormat(history);

      expect(result[0]).toEqual({
        role: "user",
        content: "Test message",
      });
      expect(result[0]).not.toHaveProperty("timestamp");
    });
  });
});
