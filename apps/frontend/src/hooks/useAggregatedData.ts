import { useMemo } from 'react';
import { EntityChange } from '../types/api';

export const useAggregatedData = (changes: EntityChange[]) => {
  return useMemo(() => {
    // Group changes by entity_id to get current state
    const entityMap = new Map<string, EntityChange[]>();

    changes.forEach(change => {
      if (!entityMap.has(change.entity_id)) {
        entityMap.set(change.entity_id, []);
      }
      entityMap.get(change.entity_id)!.push(change);
    });

    // Get the most recent change for each property of each entity
    const currentEntityState = new Map<
      string,
      Record<string, string | number>
    >();

    entityMap.forEach((entityChanges, entityId) => {
      const propertyMap = new Map<string, EntityChange>();

      // Get the most recent change for each property
      entityChanges.forEach(change => {
        const key = `${change.property_name}`;
        const existing = propertyMap.get(key);

        if (
          !existing ||
          new Date(change.timestamp) > new Date(existing.timestamp)
        ) {
          propertyMap.set(key, change);
        }
      });

      // Convert to object
      const entityState: Record<string, string | number> = {};
      propertyMap.forEach((change, propertyName) => {
        entityState[propertyName] = change.value;
      });

      // Add entity_type to the state
      if (entityChanges.length > 0) {
        entityState.entity_type = entityChanges[0].entity_type as string;
      }

      currentEntityState.set(entityId, entityState);
    });

    // Calculate KPI metrics
    const threats = Array.from(currentEntityState.entries()).filter(
      ([, state]) => state.entity_type === 'Threat'
    );

    const activeThreats = threats.length;

    // Calculate average threat score
    const threatScores = Array.from(currentEntityState.values())
      .filter(state => state.threat_score !== undefined)
      .map(state => parseFloat(state.threat_score as string));

    const avgThreatScore =
      threatScores.length > 0
        ? (
            threatScores.reduce((a, b) => a + b, 0) / threatScores.length
          ).toFixed(2)
        : '0.00';

    // Calculate AI confidence (using confidence_score)
    const aiConfidences = Array.from(currentEntityState.values())
      .filter(state => state.confidence_score !== undefined)
      .map(state => parseFloat(state.confidence_score as string));

    const avgConfidence =
      aiConfidences.length > 0
        ? Math.round(
            (aiConfidences.reduce((a, b) => a + b, 0) / aiConfidences.length) *
              100
          )
        : 0;

    // Calculate total connections (using connection_count and network_connections)
    const totalConnections = Array.from(currentEntityState.values())
      .filter(
        state =>
          state.connection_count !== undefined ||
          state.network_connections !== undefined
      )
      .reduce((total, state) => {
        const connectionCount = state.connection_count
          ? parseFloat(state.connection_count as string)
          : 0;
        const networkConnections = state.network_connections
          ? parseFloat(state.network_connections as string)
          : 0;
        return total + connectionCount + networkConnections;
      }, 0);

    // Calculate threat severity distribution
    const threatSeverityDistribution: Record<string, number> = {};
    Array.from(currentEntityState.values())
      .filter(state => state.severity !== undefined)
      .forEach(state => {
        const severity = state.severity;
        threatSeverityDistribution[severity] =
          (threatSeverityDistribution[severity] || 0) + 1;
      });

    // Calculate AI agent activity by status
    const aiAgentActivity: Record<string, number> = {};
    Array.from(currentEntityState.values())
      .filter(state => state.status !== undefined)
      .forEach(state => {
        const status = state.status;
        aiAgentActivity[status] = (aiAgentActivity[status] || 0) + 1;
      });

    // Calculate network activity by status (since we don't have protocol data)
    const protocolUsage: Record<string, number> = {};
    Array.from(currentEntityState.values())
      .filter(
        state =>
          state.routing_status !== undefined || state.status !== undefined
      )
      .forEach(state => {
        const status = state.routing_status || state.status;
        if (status) {
          protocolUsage[status] = (protocolUsage[status] || 0) + 1;
        }
      });

    // Calculate entity changes by day (last 7 days)
    const entityChangesByDay: Record<string, number> = {};
    const now = new Date();

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      entityChangesByDay[dateStr] = 0;
    }

    // Count changes by day
    changes.forEach(change => {
      const changeDate = new Date(change.timestamp).toISOString().split('T')[0];
      if (entityChangesByDay[changeDate] !== undefined) {
        entityChangesByDay[changeDate]++;
      }
    });

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
