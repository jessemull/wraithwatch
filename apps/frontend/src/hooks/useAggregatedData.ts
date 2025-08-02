import { useMemo } from 'react';
import { EntityChange, AggregatedMetrics, EntityState } from '../types/api';

// Helper function to get the most recent change for each property...

const getCurrentEntityState = (
  changes: EntityChange[]
): Map<string, EntityState> => {
  const entityMap = new Map<string, EntityChange[]>();

  // Group changes by entity_id...

  changes.forEach(change => {
    if (!entityMap.has(change.entity_id)) {
      entityMap.set(change.entity_id, []);
    }
    entityMap.get(change.entity_id)!.push(change);
  });

  const currentEntityState = new Map<string, EntityState>();

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

    const entityState: EntityState = {
      entity_type: entityChanges[0]?.entity_type || 'Unknown',
    };

    propertyMap.forEach((change, propertyName) => {
      entityState[propertyName] = change.value;
    });

    currentEntityState.set(entityId, entityState);
  });

  return currentEntityState;
};

// Helper function to calculate numeric average...

const calculateAverage = (values: number[]): number => {
  return values.length > 0
    ? values.reduce((a, b) => a + b, 0) / values.length
    : 0;
};

// Helper function to extract numeric values safely...

const extractNumericValues = (
  entityStates: EntityState[],
  propertyName: string
): number[] => {
  return entityStates
    .filter(state => state[propertyName] !== undefined)
    .map(state => {
      const value = state[propertyName];
      return typeof value === 'string' ? parseFloat(value) : Number(value);
    })
    .filter(value => !isNaN(value));
};

// Helper function to count by property...

const countByProperty = (
  entityStates: EntityState[],
  propertyName: string
): Record<string, number> => {
  const distribution: Record<string, number> = {};

  entityStates
    .filter(state => state[propertyName] !== undefined)
    .forEach(state => {
      const value = String(state[propertyName]);
      distribution[value] = (distribution[value] || 0) + 1;
    });

  return distribution;
};

// Helper function to calculate entity changes by day...

const calculateEntityChangesByDay = (
  changes: EntityChange[]
): Record<string, number> => {
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
};

export const useAggregatedData = (
  changes: EntityChange[]
): AggregatedMetrics => {
  return useMemo(() => {
    if (!changes || changes.length === 0) {
      return {
        activeThreats: 0,
        threatScore: '0.00',
        aiConfidence: 0,
        totalConnections: 0,
        threatSeverityDistribution: {},
        aiAgentActivity: {},
        protocolUsage: {},
        entityChangesByDay: {},
      };
    }

    // Get current entity state...

    const currentEntityState = getCurrentEntityState(changes);
    const entityStates = Array.from(currentEntityState.values());

    // Calculate active threats...

    const activeThreats = entityStates.filter(
      state => state.entity_type === 'Threat'
    ).length;

    // Calculate average threat score...

    const threatScores = extractNumericValues(entityStates, 'threat_score');
    const avgThreatScore = calculateAverage(threatScores).toFixed(2);

    // Calculate AI confidence...

    const aiConfidences = extractNumericValues(
      entityStates,
      'confidence_score'
    );
    const avgConfidence = Math.round(calculateAverage(aiConfidences) * 100);

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

    const threatSeverityDistribution = countByProperty(
      entityStates,
      'severity'
    );
    const aiAgentActivity = countByProperty(entityStates, 'status');

    // Calculate protocol usage (using routing_status or status)...

    const protocolUsage: Record<string, number> = {};
    entityStates
      .filter(
        state =>
          state.routing_status !== undefined || state.status !== undefined
      )
      .forEach(state => {
        const status = state.routing_status || state.status;
        if (status) {
          const statusStr = String(status);
          protocolUsage[statusStr] = (protocolUsage[statusStr] || 0) + 1;
        }
      });

    // Calculate entity changes by day...

    const entityChangesByDay = calculateEntityChangesByDay(changes);

    return {
      activeThreats,
      threatScore: avgThreatScore,
      aiConfidence: avgConfidence,
      totalConnections,
      threatSeverityDistribution,
      aiAgentActivity,
      protocolUsage,
      entityChangesByDay,
    };
  }, [changes]);
};
