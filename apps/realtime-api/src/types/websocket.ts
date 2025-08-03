export interface WebSocketConnection {
  socket: {
    readyState: number;
    send: (data: string) => void;
    on: (event: string, handler: (data?: unknown) => void) => void;
  };
}

export interface WebSocketHandlers {
  onConnectionOpen: () => void;
  onConnectionClose: () => void;
  onConnectionError: (error: Event) => void;
  onMessageReceived: (message: unknown) => void;
}

export interface WebSocketBaseMessage {
  type: string;
  payload: unknown;
}
