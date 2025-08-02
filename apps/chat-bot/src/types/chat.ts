export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  userId?: string;
}

export interface ChatResponse {
  message: string;
  history: ChatMessage[];
  timestamp: string;
  requestId: string;
}
