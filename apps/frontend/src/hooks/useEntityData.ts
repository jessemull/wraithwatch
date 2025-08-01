import { useState, useEffect, useCallback } from 'react';
import { Entity } from '../types/entity';
import { EntityChange, HistoryQuery } from '../types/api';
import { config } from '../config';

export const useEntityData = () => {
  const [changes, setChanges] = useState<EntityChange[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const transformChangesToEntities = (changes: EntityChange[]): Entity[] => {
    const entityMap = new Map<string, Entity>();

    // Debug: Log unique entity IDs
    const uniqueEntityIds = [...new Set(changes.map(c => c.entity_id))];
    console.log('Unique entity IDs:', uniqueEntityIds);
    console.log('Total changes:', changes.length);

    changes.forEach(change => {
      if (!entityMap.has(change.entity_id)) {
        entityMap.set(change.entity_id, {
          id: change.entity_id,
          name: change.entity_id,
          type: change.entity_type as Entity['type'],
          properties: {},
          lastSeen: change.timestamp,
          changesToday: 0,
        });
      }

      const entity = entityMap.get(change.entity_id)!;

      entity.properties[change.property_name] = {
        name: change.property_name,
        currentValue: change.value,
        lastChanged: change.timestamp,
        history: [
          {
            timestamp: change.timestamp,
            oldValue: change.previous_value || change.value,
            newValue: change.value,
          },
        ],
      };

      if (new Date(change.timestamp) > new Date(entity.lastSeen)) {
        entity.lastSeen = change.timestamp;
      }
    });

    return Array.from(entityMap.values());
  };

  const fetchRecentChanges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${config.api.baseUrl}/api/history/recent?limit=100`
      );
      if (!response.ok) throw new Error('Failed to fetch data');

      const result = await response.json();
      const changes = result.data;

      console.log('API Response:', result);
      console.log('Changes received:', changes.length);
      console.log('First change:', changes[0]);

      setChanges(changes);
      const transformedEntities = transformChangesToEntities(changes);
      console.log('Transformed entities:', transformedEntities.length);
      console.log('First entity:', transformedEntities[0]);
      setEntities(transformedEntities);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  const getEntityHistory = async (
    entityId: string,
    options: HistoryQuery = {}
  ) => {
    const params = new URLSearchParams();
    if (options.propertyName)
      params.append('propertyName', options.propertyName);
    if (options.startTime) params.append('startTime', options.startTime);
    if (options.endTime) params.append('endTime', options.endTime);
    if (options.limit) params.append('limit', options.limit.toString());

    const response = await fetch(
      `${config.api.baseUrl}/api/history/entity/${entityId}?${params}`
    );
    if (!response.ok) throw new Error('Failed to fetch entity history');

    const result = await response.json();
    return result.data;
  };

  const getPropertyHistory = async (
    entityId: string,
    propertyName: string,
    options: HistoryQuery = {}
  ) => {
    const params = new URLSearchParams();
    if (options.startTime) params.append('startTime', options.startTime);
    if (options.endTime) params.append('endTime', options.endTime);
    if (options.limit) params.append('limit', options.limit.toString());

    const response = await fetch(
      `${config.api.baseUrl}/api/history/entity/${entityId}/property/${propertyName}?${params}`
    );
    if (!response.ok) throw new Error('Failed to fetch property history');

    const result = await response.json();
    return result.data;
  };

  useEffect(() => {
    fetchRecentChanges();
  }, [fetchRecentChanges]);

  return {
    entities,
    changes,
    loading,
    error,
    refetch: fetchRecentChanges,
    getEntityHistory,
    getPropertyHistory,
  };
};
