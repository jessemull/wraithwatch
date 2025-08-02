export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
  userId?: string;
}

export interface ChatResponse {
  message: string;
  history: ChatMessage[];
  timestamp: string;
  requestId: string;
}

export interface ErrorResponse {
  error: string;
  timestamp: string;
  requestId: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
