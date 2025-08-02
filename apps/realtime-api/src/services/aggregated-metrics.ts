import { EntityChange } from '../types/dynamodb';
import { createComponentLogger } from '../utils/logger';
import NodeCache from 'node-cache';

const logger = createComponentLogger('aggregated-metrics-service');

export interface AggregatedMetrics {
  activeThreats: number;
  threatScore: string;
  aiConfidence: number;
  totalConnections: number;
  threatSeverityDistribution: Record<string, number>;
  aiAgentActivity: Record<string, number>;
  protocolUsage: Record<string, number>;
  entityChangesByDay: Record<string, number>;
}

export class AggregatedMetricsService {
  private metricsCache: NodeCache;
  private lastUpdate: Date | null = null;

  constructor() {
    this.metricsCache = new NodeCache({ stdTTL: 30 * 24 * 60 * 60 });
  }

  async calculateMetrics(changes: EntityChange[]): Promise<AggregatedMetrics> {
    // Create cache key based on data hash to ensure cache invalidation when data changes...
    
    const dataHash = this.generateDataHash(changes);
    const cacheKey = `dashboard_metrics_${dataHash}`;

    const cachedMetrics = this.metricsCache.get<AggregatedMetrics>(cacheKey);
    if (cachedMetrics) {
      logger.info('Returning cached metrics');
      return cachedMetrics;
    }

    logger.info('Calculating aggregated metrics...');

    if (!changes || changes.length === 0) {
      const emptyMetrics: AggregatedMetrics = {
        activeThreats: 0,
        threatScore: '0.00',
        aiConfidence: 0,
        totalConnections: 0,
        threatSeverityDistribution: {},
        aiAgentActivity: {},
        protocolUsage: {},
        entityChangesByDay: {},
      };

      this.metricsCache.set(cacheKey, emptyMetrics);
      return emptyMetrics;
    }

    // Get current entity state...

    const currentEntityState = this.getCurrentEntityState(changes);
    const entityStates = Array.from(currentEntityState.values());

    // Calculate active threats...

    const activeThreats = entityStates.filter(
      state => state.entity_type === 'Threat'
    ).length;

    // Calculate average threat score...

    const threatScores = this.extractNumericValues(
      entityStates,
      'threat_score'
    );
    const avgThreatScore = this.calculateAverage(threatScores).toFixed(2);

    // Calculate AI confidence...

    const aiConfidences = this.extractNumericValues(
      entityStates,
      'confidence_score'
    );
    const avgConfidence = Math.round(
      this.calculateAverage(aiConfidences) * 100
    );

    // Calculate total connections...

    const totalConnections = Math.round(
      entityStates
        .filter(
          state =>
            state.connection_count !== undefined ||
            state.network_connections !== undefined
        )
        .reduce((total, state) => {
          const connectionCount = state.connection_count
            ? typeof state.connection_count === 'string'
              ? parseFloat(state.connection_count)
              : Number(state.connection_count)
            : 0;
          const networkConnections = state.network_connections
            ? typeof state.network_connections === 'string'
              ? parseFloat(state.network_connections)
              : Number(state.network_connections)
            : 0;
          return total + connectionCount + networkConnections;
        }, 0)
    );

    // Calculate distributions...

    const threatSeverityDistribution = this.countByProperty(
      entityStates,
      'severity'
    );
    
    // Count AI agents by status, but include all AI agents
    const aiAgentActivity = this.countAIAgentsByStatus(entityStates);

    // Calculate protocol usage (Network Status Distribution)...

    const protocolUsage: Record<string, number> = {};
    entityStates
      .filter(state => state.entity_type === 'Network_Node')
      .forEach(state => {
        const status = state.routing_status;
        if (status) {
          const statusStr = String(status);
          protocolUsage[statusStr] = (protocolUsage[statusStr] || 0) + 1;
        }
      });

    // Calculate entity changes by day...

    const entityChangesByDay = this.calculateEntityChangesByDay(changes);

    const metrics: AggregatedMetrics = {
      activeThreats,
      threatScore: avgThreatScore,
      aiConfidence: avgConfidence,
      totalConnections,
      threatSeverityDistribution,
      aiAgentActivity,
      protocolUsage,
      entityChangesByDay,
    };

    // Cache the results...

    this.metricsCache.set(cacheKey, metrics);
    this.lastUpdate = new Date();

    logger.info('Metrics calculated and cached successfully');
    return metrics;
  }

  private getCurrentEntityState(changes: EntityChange[]): Map<string, any> {
    const entityMap = new Map<string, EntityChange[]>();

    // Group changes by entity_id...

    changes.forEach(change => {
      if (!entityMap.has(change.entity_id)) {
        entityMap.set(change.entity_id, []);
      }
      entityMap.get(change.entity_id)!.push(change);
    });

    const currentEntityState = new Map<string, any>();

    entityMap.forEach((entityChanges, entityId) => {
      const propertyMap = new Map<string, EntityChange>();

      // Get the most recent change for each property...

      entityChanges.forEach(change => {
        const key = change.property_name;
        const existing = propertyMap.get(key);

        try {
          const changeTimestamp = new Date(change.timestamp);
          if (isNaN(changeTimestamp.getTime())) {
            return;
          }

          if (!existing) {
            propertyMap.set(key, change);
          } else {
            try {
              const existingTimestamp = new Date(existing.timestamp);
              if (
                !isNaN(existingTimestamp.getTime()) &&
                changeTimestamp > existingTimestamp
              ) {
                propertyMap.set(key, change);
              }
            } catch {
              propertyMap.set(key, change);
            }
          }
        } catch {
          return;
        }
      });

      // Convert to object...

      const entityState: any = {
        entity_type: entityChanges[0]?.entity_type || 'Unknown',
      };

      propertyMap.forEach((change, propertyName) => {
        entityState[propertyName] = change.value;
      });

      currentEntityState.set(entityId, entityState);
    });

    return currentEntityState;
  }

  private calculateAverage(values: number[]): number {
    return values.length > 0
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;
  }

  private extractNumericValues(
    entityStates: any[],
    propertyName: string
  ): number[] {
    return entityStates
      .filter(state => state[propertyName] !== undefined)
      .map(state => {
        const value = state[propertyName];
        return typeof value === 'string' ? parseFloat(value) : Number(value);
      })
      .filter(value => !isNaN(value));
  }

  private countByProperty(
    entityStates: any[],
    propertyName: string
  ): Record<string, number> {
    const distribution: Record<string, number> = {};

    entityStates
      .filter(state => state[propertyName] !== undefined)
      .forEach(state => {
        const value = String(state[propertyName]);
        distribution[value] = (distribution[value] || 0) + 1;
      });

    return distribution;
  }

  private countAIAgentsByStatus(entityStates: any[]): Record<string, number> {
    const distribution: Record<string, number> = {};

    // Count all AI agents (entities with entity_type === 'AI_Agent')
    const aiAgents = entityStates.filter(state => state.entity_type === 'AI_Agent');
    
    // Log for debugging
    logger.info(`Found ${aiAgents.length} AI agents`);
    aiAgents.forEach((state, index) => {
      logger.info(`AI Agent ${index + 1}: entity_type=${state.entity_type}, status=${state.status}, all_props=${Object.keys(state)}`);
    });
    
    aiAgents.forEach(state => {
      const status = state.status || 'offline'; // Default to offline if no status
      const statusStr = String(status);
      
      // Use the actual status values as categories
      distribution[statusStr] = (distribution[statusStr] || 0) + 1;
    });

    logger.info(`AI Agent Activity distribution: ${JSON.stringify(distribution)}`);
    return distribution;
  }

  private calculateEntityChangesByDay(
    changes: EntityChange[]
  ): Record<string, number> {
    const entityChangesByDay: Record<string, number> = {};
    const now = new Date();

    // Initialize last 7 days...

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      entityChangesByDay[dateStr] = 0;
    }

    // Count changes by day...

    changes.forEach(change => {
      try {
        const timestamp = new Date(change.timestamp);
        if (isNaN(timestamp.getTime())) {
          return;
        }
        const changeDate = timestamp.toISOString().split('T')[0];
        if (entityChangesByDay[changeDate] !== undefined) {
          entityChangesByDay[changeDate]++;
        }
      } catch {
        return;
      }
    });

    return entityChangesByDay;
  }

  getLastUpdate(): Date | null {
    return this.lastUpdate;
  }

  async preloadCache(changes: EntityChange[]): Promise<void> {
    try {
      logger.info('Preloading metrics cache...');
      await this.calculateMetrics(changes);
      logger.info('Metrics cache preloaded successfully');
    } catch (error) {
      logger.error('Error preloading metrics cache', { error });
      throw error;
    }
  }

  clearCache(): void {
    this.metricsCache.flushAll();
    this.lastUpdate = null;
    logger.info('Metrics cache cleared');
  }

  private generateDataHash(changes: EntityChange[]): string {
    // Create a simple hash based on data length and last timestamp...

    if (!changes || changes.length === 0) {
      return 'empty';
    }

    const lastChange = changes[changes.length - 1];
    const dataLength = changes.length;
    const lastTimestamp = lastChange?.timestamp || '';

    // Simple hash combining data length and last timestamp...

    return `${dataLength}_${lastTimestamp}`;
  }
}
