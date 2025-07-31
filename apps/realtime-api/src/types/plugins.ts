import { WebSocketManager } from '../services/websocket-manager';
import { EntityManager } from '../services/entity-manager';

export interface WebSocketPluginOptions {
  websocketManager: WebSocketManager;
  entityManager: EntityManager;
} 