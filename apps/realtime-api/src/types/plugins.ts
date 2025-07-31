import { EntityManager } from '../services/entity-manager';
import { WebSocketManager } from '../services/websocket-manager';

export interface WebSocketPluginOptions {
  websocketManager: WebSocketManager;
  entityManager: EntityManager;
} 