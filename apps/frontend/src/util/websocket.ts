import { WEBSOCKET_MESSAGE_TYPES } from '../constants';
import {
  EntityListMessage,
  EntityUpdateMessage,
  WebSocketMessage,
} from '../types';

export const isEntityListMessage = (
  message: WebSocketMessage
): message is EntityListMessage => {
  return Boolean(
    message.type === WEBSOCKET_MESSAGE_TYPES.ENTITY_LIST &&
      message.payload &&
      typeof message.payload === 'object' &&
      message.payload !== null &&
      'entities' in message.payload
  );
};

export const isEntityUpdateMessage = (
  message: WebSocketMessage
): message is EntityUpdateMessage => {
  return Boolean(
    message.type === WEBSOCKET_MESSAGE_TYPES.ENTITY_UPDATE &&
      message.payload &&
      typeof message.payload === 'object' &&
      message.payload !== null &&
      'entityId' in message.payload
  );
};

export const isConnectionStatusMessage = (
  message: WebSocketMessage
): message is {
  type: 'connection_status';
  payload: { status: string };
} => {
  return Boolean(
    message.type === WEBSOCKET_MESSAGE_TYPES.CONNECTION_STATUS &&
      message.payload &&
      typeof message.payload === 'object' &&
      message.payload !== null &&
      'status' in message.payload
  );
};
