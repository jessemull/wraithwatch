// Server configuration.

export const DEFAULT_PORT = 3001;
export const DEFAULT_HOST = '0.0.0.0';

// AWS configuration.

export const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

// AWS table name.

export const DYNAMODB_TABLE_NAME =
  process.env.DYNAMODB_TABLE_NAME || 'wraithwatch-entity-changes';

// WebSocket configuration.

export const WEBSOCKET_PATH = '/ws';

// Entity update configuration.

export const DEFAULT_UPDATE_INTERVAL = parseInt(
  process.env.UPDATE_INTERVAL || '2000'
); // 2 seconds

export const MAX_PROPERTY_HISTORY_LENGTH = 10;

// Logging configuration.

export const DEFAULT_LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// DynamoDB configuration.

export const DYNAMODB_CONSTANTS = {
  BATCH_WRITE_LIMIT: 25,
  SCAN_LIMIT: 1000,
  DEFAULT_QUERY_LIMIT: 100,
  DEFAULT_SCAN_LIMIT: 10000,
  ENTITY_SUMMARY_LIMIT: 1000,
  INDEX_NAME: 'TimestampEntityIndex',
} as const;

// Re-export property configuration
export * from './property-config';
