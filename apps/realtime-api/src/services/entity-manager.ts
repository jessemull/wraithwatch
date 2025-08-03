import {
  Entity,
  EntityUpdateMessage,
  EntityListMessage,
} from '../types/entity';
import { shouldChangeProperty } from '../utils/entity-utils';
import { WebSocketManager } from './websocket-manager';
import { WebSocketConnection } from '../types/websocket';
import { createComponentLogger } from '../utils/logger';
import {
  MAX_PROPERTY_HISTORY_LENGTH,
  DEFAULT_UPDATE_INTERVAL,
} from '../constants';
import NodeCache from 'node-cache';
import { DynamoDBService } from './dynamodb';
import { IPropertyValueGenerator, IEntityCache } from '../types/services';
import { PropertyValueGenerator } from './property-value-generator';
import { NodeCacheEntityCache } from './entity-cache';
import { transformDatabaseDataToEntities } from '../utils/entity-transformer';

const logger = createComponentLogger('entity-manager');

export class EntityManager {
  private entityCache: IEntityCache;
  private websocketManager: WebSocketManager;
  private dynamoDBService: DynamoDBService;
  private propertyValueGenerator: IPropertyValueGenerator;
  private isInitialized: boolean = false;

  constructor(
    websocketManager: WebSocketManager,
    dynamoDBService: DynamoDBService,
    entityCache?: IEntityCache,
    propertyValueGenerator?: IPropertyValueGenerator
  ) {
    this.entityCache =
      entityCache ||
      new NodeCacheEntityCache(
        new NodeCache({
          stdTTL: 3 * 60 * 60,
          checkperiod: 600,
        })
      );
    this.websocketManager = websocketManager;
    this.dynamoDBService = dynamoDBService;
    this.propertyValueGenerator =
      propertyValueGenerator || new PropertyValueGenerator();
  }

  async initializeFromDatabase(): Promise<void> {
    try {
      logger.info('Loading entities from database...');

      const dbData = await this.dynamoDBService.getAllData();
      const entities = transformDatabaseDataToEntities(dbData);

      entities.forEach(entity => {
        this.entityCache.set(entity.id, entity);
      });

      this.isInitialized = true;
      logger.info(
        { entityCount: entities.length },
        'Entities loaded from database'
      );

      const entityTypes = new Set(entities.map(e => e.type));
      logger.info(
        { entityTypes: Array.from(entityTypes) },
        'Entity types found in database'
      );

      entities.forEach(entity => {
        const propertyNames = Object.keys(entity.properties);
        logger.info(
          {
            entityId: entity.id,
            entityType: entity.type,
            propertyCount: propertyNames.length,
            properties: propertyNames,
          },
          'Entity loaded'
        );
      });
    } catch (error) {
      logger.error({ error }, 'Failed to load entities from database');
      throw error;
    }
  }

  getEntities(): Entity[] {
    const keys = this.entityCache.keys();
    return keys
      .map(key => this.entityCache.get<Entity>(key))
      .filter(Boolean) as Entity[];
  }

  sendEntityList(client: WebSocketConnection): void {
    const entities = this.getEntities();
    const message: EntityListMessage = {
      type: 'entity_list',
      payload: { entities },
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
    if (!this.isInitialized) {
      logger.warn('EntityManager not initialized, skipping updates');
      return;
    }

    const entities = this.getEntities();

    entities.forEach(entity => {
      this.processEntityUpdates(entity);
    });
  }

  private processEntityUpdates(entity: Entity): void {
    const entityType = entity.type;
    const allowedProperties =
      this.propertyValueGenerator.getAllowedPropertiesForEntityType(entityType);

    logger.debug(
      {
        entityId: entity.id,
        entityType,
        allowedProperties,
        actualProperties: Object.keys(entity.properties),
      },
      'Processing entity for updates'
    );

    // Ensure all allowed properties exist
    allowedProperties.forEach(propertyName => {
      if (!entity.properties[propertyName]) {
        const initialValue = this.propertyValueGenerator.generatePropertyValue(
          propertyName,
          null,
          entityType
        );
        entity.properties[propertyName] = {
          name: propertyName,
          currentValue: initialValue,
          lastChanged: new Date().toISOString(),
          history: [],
        };
        logger.info(
          { entityId: entity.id, propertyName, initialValue },
          'Created missing property'
        );
      }
    });

    Object.entries(entity.properties).forEach(([propertyName, property]) => {
      if (!allowedProperties.includes(propertyName)) {
        logger.debug(
          { entityId: entity.id, propertyName, entityType },
          'Skipping property - not allowed for entity type'
        );
        return;
      }

      const changeFrequency =
        this.propertyValueGenerator.getPropertyChangeFrequency(propertyName);

      if (shouldChangeProperty(changeFrequency)) {
        this.updateEntityProperty(entity, propertyName, property);
      }
    });
  }

  private updateEntityProperty(
    entity: Entity,
    propertyName: string,
    property: any
  ): void {
    const oldValue = property.currentValue;
    const newValue = this.propertyValueGenerator.generatePropertyValue(
      propertyName,
      oldValue,
      entity.type
    );

    property.currentValue = newValue;
    property.lastChanged = new Date().toISOString();
    entity.lastSeen = new Date().toISOString();
    entity.changesToday++;

    property.history.push({
      timestamp: property.lastChanged,
      oldValue,
      newValue,
    });

    if (property.history.length > MAX_PROPERTY_HISTORY_LENGTH) {
      property.history.shift();
    }

    this.entityCache.set(entity.id, entity);

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
        entityType: entity.type,
        propertyName,
        oldValue,
        newValue,
      },
      'Entity property updated'
    );
  }

  startUpdateGeneration(intervalMs: number = DEFAULT_UPDATE_INTERVAL): void {
    setInterval(() => {
      this.generateEntityUpdates();
    }, intervalMs);
  }
}
