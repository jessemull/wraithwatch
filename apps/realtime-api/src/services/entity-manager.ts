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

const logger = createComponentLogger('entity-manager');

export class EntityManager {
  private entityCache: NodeCache;
  private websocketManager: WebSocketManager;
  private dynamoDBService: DynamoDBService;
  private isInitialized: boolean = false;

  constructor(
    websocketManager: WebSocketManager,
    dynamoDBService: DynamoDBService
  ) {
    this.entityCache = new NodeCache({
      stdTTL: 3600,
      checkperiod: 600,
    });
    this.websocketManager = websocketManager;
    this.dynamoDBService = dynamoDBService;
  }

  async initializeFromDatabase(): Promise<void> {
    try {
      logger.info('Loading entities from database...');

      // Get data from DynamoDBService (which will use its cache)...

      const dbData = await this.dynamoDBService.getAllData();

      const entities = this.transformDatabaseDataToEntities(dbData);

      // Store entities in EntityManager cache for individual access...

      entities.forEach(entity => {
        this.entityCache.set(entity.id, entity);
      });

      this.isInitialized = true;
      logger.info(
        { entityCount: entities.length },
        'Entities loaded from database'
      );

      // Log entity types and properties for verification...

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

  private transformDatabaseDataToEntities(dbData: any[]): Entity[] {
    const entityMap = new Map<string, Entity>();

    dbData.forEach(item => {
      const entityId = item.entity_id || item.entityId;
      const propertyName = item.property_name || item.propertyName;
      const value = item.value;
      const timestamp = item.timestamp || item.TTL || new Date().toISOString();

      if (!entityMap.has(entityId)) {
        entityMap.set(entityId, {
          id: entityId,
          name: entityId,
          type: item.entity_type || 'Unknown',
          properties: {},
          lastSeen: timestamp,
          changesToday: 0,
        });
      }

      const entity = entityMap.get(entityId)!;

      if (!entity.properties[propertyName]) {
        entity.properties[propertyName] = {
          name: propertyName,
          currentValue: value,
          lastChanged: timestamp,
          history: [],
        };
      } else {
        entity.properties[propertyName].currentValue = value;
        entity.properties[propertyName].lastChanged = timestamp;
      }
    });

    return Array.from(entityMap.values());
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
      const entityType = entity.type;
      const allowedProperties =
        this.getAllowedPropertiesForEntityType(entityType);

      logger.debug(
        {
          entityId: entity.id,
          entityType,
          allowedProperties,
          actualProperties: Object.keys(entity.properties),
        },
        'Processing entity for updates'
      );

      // Ensure all allowed properties exist...

      allowedProperties.forEach(propertyName => {
        if (!entity.properties[propertyName]) {
          // Create missing property with initial value...

          const initialValue = this.generatePropertyValue(
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

        const changeFrequency = this.getPropertyChangeFrequency(propertyName);

        if (shouldChangeProperty(changeFrequency)) {
          const oldValue = property.currentValue;
          const newValue = this.generatePropertyValue(
            propertyName,
            oldValue,
            entityType
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
              entityType,
              propertyName,
              oldValue,
              newValue,
            },
            'Entity property updated'
          );
        }
      });
    });
  }

  private getPropertyChangeFrequency(propertyName: string): number {
    const frequencyMap: Record<string, number> = {
      // System properties...

      cpu_usage: 0.8,
      memory_usage: 0.6,
      network_connections: 0.9,
      disk_usage: 0.3,
      response_time: 0.7,

      // AI Agent properties...

      confidence_score: 0.5,
      active_requests: 0.8,
      model_version: 0.01,
      accuracy: 0.4,
      training_status: 0.05,
      status: 0.03,

      // Threat properties...

      threat_score: 0.3,
      severity: 0.1,
      detection_count: 0.4,
      source_ip: 0.05,
      attack_type: 0.02,
      mitigation_status: 0.08,

      // Network Node properties...

      bandwidth_usage: 0.7,
      connection_count: 0.8,
      latency: 0.6,
      packet_loss: 0.4,
      error_rate: 0.3,
      routing_status: 0.03,

      // User properties...

      login_count: 0.2,
      last_activity: 0.3,
      session_duration: 0.4,
      permission_level: 0.01,
      failed_login_attempts: 0.1,

      // Sensor properties...

      temperature: 0.6,
      humidity: 0.4,
      battery: 0.1,
    };

    return frequencyMap[propertyName] || 0.2;
  }

  private generatePropertyValue(
    propertyName: string,
    currentValue: any,
    entityType: string
  ): any {
    const valueGenerators: Record<string, () => any> = {
      // System properties...

      cpu_usage: () => Math.floor(10 + Math.random() * 85),
      memory_usage: () => Math.floor(20 + Math.random() * 70),
      network_connections: () => Math.floor(50 + Math.random() * 1950),
      disk_usage: () => Math.floor(30 + Math.random() * 55),
      response_time: () => Math.floor(10 + Math.random() * 490),
      status: () => {
        if (entityType === 'AI_Agent') {
          const statuses = ['online', 'away', 'offline', 'busy'];
          return statuses[Math.floor(Math.random() * statuses.length)];
        } else {
          const statuses = [
            'online',
            'offline',
            'maintenance',
            'degraded',
            'overloaded',
            'recovering',
          ];
          return statuses[Math.floor(Math.random() * statuses.length)];
        }
      },

      // AI Agent properties...

      confidence_score: () => 0.5 + Math.random() * 0.49,
      active_requests: () => Math.floor(5 + Math.random() * 495),
      model_version: () => {
        const versions = ['v1.2.3', 'v1.2.4', 'v1.3.0', 'v1.3.1', 'v1.4.0'];
        return versions[Math.floor(Math.random() * versions.length)];
      },
      accuracy: () => 0.7 + Math.random() * 0.28,
      training_status: () => {
        const statuses = [
          'idle',
          'training',
          'evaluating',
          'deploying',
          'failed',
        ];
        return statuses[Math.floor(Math.random() * statuses.length)];
      },

      // Threat properties...

      threat_score: () => 0.1 + Math.random() * 0.85,
      severity: () => {
        const severities = ['low', 'medium', 'high', 'critical', 'emergency'];
        return severities[Math.floor(Math.random() * severities.length)];
      },
      detection_count: () => Math.floor(1 + Math.random() * 99),
      source_ip: () => {
        const ips = [
          '192.168.1.100',
          '10.0.0.50',
          '172.16.0.25',
          '203.0.113.45',
          '198.51.100.123',
        ];
        return ips[Math.floor(Math.random() * ips.length)];
      },
      attack_type: () => {
        const types = [
          'ddos',
          'malware',
          'phishing',
          'sql_injection',
          'xss',
          'brute_force',
        ];
        return types[Math.floor(Math.random() * types.length)];
      },
      mitigation_status: () => {
        const statuses = [
          'detected',
          'investigating',
          'mitigating',
          'resolved',
          'false_positive',
        ];
        return statuses[Math.floor(Math.random() * statuses.length)];
      },

      // Network Node properties...

      bandwidth_usage: () => Math.floor(100 + Math.random() * 1900),
      connection_count: () => Math.floor(10 + Math.random() * 490),
      latency: () => Math.floor(1 + Math.random() * 199),
      packet_loss: () => Math.random() * 10,
      error_rate: () => Math.random() * 5,
      routing_status: () => {
        const statuses = [
          'optimal',
          'congested',
          'rerouting',
          'failed',
          'maintenance',
        ];
        return statuses[Math.floor(Math.random() * statuses.length)];
      },

      // User properties...

      login_count: () => Math.floor(Math.random() * 50),
      last_activity: () => {
        const activities = [
          'active',
          'idle',
          'away',
          'offline',
          'suspended',
          'locked',
        ];
        return activities[Math.floor(Math.random() * activities.length)];
      },
      session_duration: () => Math.floor(Math.random() * 480),
      permission_level: () => {
        const levels = ['guest', 'user', 'admin', 'super_admin', 'read_only'];
        return levels[Math.floor(Math.random() * levels.length)];
      },
      failed_login_attempts: () => Math.floor(Math.random() * 10),

      // Sensor properties...

      temperature: () => Math.floor(20 + Math.random() * 30),
      humidity: () => Math.floor(40 + Math.random() * 60),
      battery: () => Math.floor(Math.random() * 100),
    };

    const generator = valueGenerators[propertyName];
    return generator ? generator() : currentValue;
  }

  private getAllowedPropertiesForEntityType(entityType: string): string[] {
    const propertyMap: Record<string, string[]> = {
      System: [
        'cpu_usage',
        'memory_usage',
        'network_connections',
        'disk_usage',
        'response_time',
        'status',
      ],
      AI_Agent: [
        'confidence_score',
        'response_time',
        'active_requests',
        'model_version',
        'accuracy',
        'training_status',
        'status',
      ],
      Threat: [
        'threat_score',
        'severity',
        'detection_count',
        'source_ip',
        'attack_type',
        'mitigation_status',
      ],
      Network_Node: [
        'bandwidth_usage',
        'connection_count',
        'latency',
        'packet_loss',
        'error_rate',
        'routing_status',
      ],
      User: [
        'login_count',
        'last_activity',
        'session_duration',
        'permission_level',
        'failed_login_attempts',
      ],
      Server: [
        'cpu_usage',
        'memory_usage',
        'network_connections',
        'disk_usage',
        'response_time',
        'status',
      ],
      Workstation: [
        'cpu_usage',
        'memory_usage',
        'network_connections',
        'disk_usage',
        'response_time',
        'status',
      ],
      Sensor: ['temperature', 'humidity', 'battery', 'status'],
    };

    return propertyMap[entityType] || [];
  }

  startUpdateGeneration(intervalMs: number = DEFAULT_UPDATE_INTERVAL): void {
    setInterval(() => {
      this.generateEntityUpdates();
    }, intervalMs);
  }
}
