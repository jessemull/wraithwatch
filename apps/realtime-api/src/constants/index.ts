// Server configuration.

export const DEFAULT_PORT = 3001;
export const DEFAULT_HOST = '0.0.0.0';

// AWS configuration.

export const AWS_REGION = 'us-east-1';
export const DYNAMODB_TABLE_NAME = 'wraithwatch-entity-changes';

// WebSocket configuration.

export const WEBSOCKET_PATH = '/ws';

// Entity update configuration.

export const DEFAULT_UPDATE_INTERVAL = 2000; // 2 seconds
export const MAX_PROPERTY_HISTORY_LENGTH = 10;

// Logging configuration.

export const DEFAULT_LOG_LEVEL = 'info'; 