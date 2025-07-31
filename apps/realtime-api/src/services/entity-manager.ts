import { Entity, EntityUpdateMessage, EntityListMessage } from '../types/entity';
import { initializeEntities, generateRandomValue, shouldChangeProperty, demoEntities } from '../utils/demo-data';
import { WebSocketManager } from './websocket-manager';
import { WebSocketConnection } from '../types/websocket';
import { createComponentLogger } from '../utils/logger';
import { MAX_PROPERTY_HISTORY_LENGTH, DEFAULT_UPDATE_INTERVAL } from '../constants';

const logger = createComponentLogger('entity-manager');

export class EntityManager {
  private entities: Entity[];
  private websocketManager: WebSocketManager;

  constructor(websocketManager: WebSocketManager) {
    this.entities = initializeEntities();
    this.websocketManager = websocketManager;
  }

  getEntities(): Entity[] {
    return this.entities;
  }

  sendEntityList(client: WebSocketConnection): void {
    const message: EntityListMessage = {
      type: 'entity_list',
      payload: { entities: this.entities },
    };
    client.socket.send(JSON.stringify(message));
  }

  sendConnectionStatus(client: WebSocketConnection): void {
    client.socket.send(
      JSON.stringify({
        type: 'connection_status',
        payload: { status: 'connected' },
      })
    );
  }

  generateEntityUpdates(): void {
    this.entities.forEach(entity => {
      Object.entries(entity.properties).forEach(([propertyName, property]) => {
        // Find the demo config for this entity and property...

        const demoConfig = demoEntities.find(e => e.id === entity.id);
        if (!demoConfig || !demoConfig.properties[propertyName]) return;

        const propConfig = demoConfig.properties[propertyName];

        // Check if this property should change based on frequency...

        if (shouldChangeProperty(propConfig.changeFrequency)) {
          const oldValue = property.currentValue;
          const newValue = generateRandomValue(propConfig);

          // Update the entity...

          property.currentValue = newValue;
          property.lastChanged = new Date().toISOString();
          entity.lastSeen = new Date().toISOString();
          entity.changesToday++;

          // Add to history (keep last 10 changes)...

          property.history.push({
            timestamp: property.lastChanged,
            oldValue,
            newValue,
          });

          if (property.history.length > MAX_PROPERTY_HISTORY_LENGTH) {
            property.history.shift();
          }

          // Broadcast the update...
          
          const updateMessage: EntityUpdateMessage = {
            type: 'entity_update',
            payload: {
              entityId: entity.id,
              property: propertyName,
              timestamp: property.lastChanged,
              oldValue,
              newValue,
            },
          };

          this.websocketManager.broadcast(updateMessage);

          logger.info(
            { 
              entityId: entity.id, 
              entityName: entity.name, 
              propertyName, 
              oldValue, 
              newValue 
            }, 
            'Entity property updated'
          );
        }
      });
    });
  }

  startUpdateGeneration(intervalMs: number = DEFAULT_UPDATE_INTERVAL): void {
    setInterval(() => {
      this.generateEntityUpdates();
    }, intervalMs);
  }
} 