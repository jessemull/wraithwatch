export const MAX_PROPERTY_HISTORY_LENGTH = 10;

export const WEBSOCKET_CONNECTION_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
} as const;

export const WEBSOCKET_MESSAGE_TYPES = {
  ENTITY_UPDATE: 'entity_update',
  ENTITY_LIST: 'entity_list',
  PROPERTY_CHANGE: 'property_change',
  CONNECTION_STATUS: 'connection_status',
} as const;
