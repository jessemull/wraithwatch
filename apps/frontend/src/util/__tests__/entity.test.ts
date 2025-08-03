import {
  getEntityTypeColor,
  getStatusColor,
  formatPropertyName,
  formatText,
  formatEntityType,
  getUnit,
  formatTime,
  updateEntityProperty,
  updateEntityInList,
  getEntityName,
} from '../entity';
import { Entity } from '../../types';

describe('Entity Utility Functions', () => {
  describe('getEntityTypeColor', () => {
    it('returns correct color for known entity types', () => {
      expect(getEntityTypeColor('AI_Agent')).toBe('bg-blue-500');
      expect(getEntityTypeColor('Network_Node')).toBe('bg-green-500');
      expect(getEntityTypeColor('Threat')).toBe('bg-red-500');
      expect(getEntityTypeColor('System')).toBe('bg-yellow-500');
      expect(getEntityTypeColor('User')).toBe('bg-purple-500');
    });

    it('returns default color for unknown entity types', () => {
      expect(getEntityTypeColor('UnknownType')).toBe('bg-gray-500');
    });
  });

  describe('getStatusColor', () => {
    it('returns correct colors for routing_status', () => {
      expect(getStatusColor('routing_status', 'optimal')).toBe(
        'bg-green-500 text-white'
      );
      expect(getStatusColor('routing_status', 'maintenance')).toBe(
        'bg-yellow-500 text-black'
      );
      expect(getStatusColor('routing_status', 'degraded')).toBe(
        'bg-orange-500 text-white'
      );
      expect(getStatusColor('routing_status', 'unknown')).toBe(
        'bg-gray-500 text-white'
      );
    });

    it('returns correct colors for severity', () => {
      expect(getStatusColor('severity', 'critical')).toBe(
        'bg-red-500 text-white'
      );
      expect(getStatusColor('severity', 'high')).toBe(
        'bg-orange-500 text-white'
      );
      expect(getStatusColor('severity', 'medium')).toBe(
        'bg-yellow-500 text-black'
      );
      expect(getStatusColor('severity', 'low')).toBe('bg-green-500 text-white');
    });

    it('returns default color for unknown status types', () => {
      expect(getStatusColor('unknown_status', 'value')).toBe(
        'bg-gray-500 text-white'
      );
    });
  });

  describe('formatPropertyName', () => {
    it('formats property names correctly', () => {
      expect(formatPropertyName('cpu_usage')).toBe('Cpu Usage');
      expect(formatPropertyName('memory_usage')).toBe('Memory Usage');
      expect(formatPropertyName('network_connections')).toBe(
        'Network Connections'
      );
    });
  });

  describe('formatText', () => {
    it('formats text correctly', () => {
      expect(formatText('hello_world')).toBe('Hello World');
      expect(formatText('test_string')).toBe('Test String');
      expect(formatText('simple')).toBe('Simple');
    });
  });

  describe('formatEntityType', () => {
    it('formats entity types correctly', () => {
      expect(formatEntityType('AI_Agent')).toBe('AI Agent');
      expect(formatEntityType('Network_Node')).toBe('Network Node');
      expect(formatEntityType('System')).toBe('System');
    });
  });

  describe('getUnit', () => {
    it('returns correct units for different property types', () => {
      expect(getUnit('error_rate')).toBe('%');
      expect(getUnit('packet_loss')).toBe('%');
      expect(getUnit('latency')).toBe('ms');
      expect(getUnit('bandwidth_usage')).toBe('Mbps');
      expect(getUnit('connection_count')).toBe('');
      expect(getUnit('session_duration')).toBe('min');
      expect(getUnit('unknown_property')).toBe('');
    });
  });

  describe('formatTime', () => {
    it('formats time correctly', () => {
      const testDate = new Date('2023-01-01T12:00:00Z');
      const result = formatTime(testDate.toISOString());
      expect(typeof result).toBe('string');
      expect(result).toMatch(/\d{1,2}:\d{2}:\d{2}/);
    });
  });

  describe('updateEntityProperty', () => {
    const mockEntity: Entity = {
      id: 'test-entity',
      type: 'System',
      properties: {
        cpu_usage: {
          name: 'cpu_usage',
          currentValue: 50,
          lastChanged: '2023-01-01T10:00:00Z',
          history: [
            { timestamp: '2023-01-01T09:00:00Z', oldValue: 40, newValue: 50 },
          ],
        },
      },
      lastSeen: '2023-01-01T10:00:00Z',
      changesToday: 1,
    };

    it('updates existing property correctly', () => {
      const updatedEntity = updateEntityProperty(
        mockEntity,
        75,
        50,
        'cpu_usage',
        '2023-01-01T11:00:00Z'
      );

      expect(updatedEntity.properties?.cpu_usage?.currentValue).toBe(75);
      expect(updatedEntity.properties?.cpu_usage?.lastChanged).toBe(
        '2023-01-01T11:00:00Z'
      );
      expect(updatedEntity.lastSeen).toBe('2023-01-01T11:00:00Z');
      expect(updatedEntity.changesToday).toBe(2);
    });

    it('creates new property if it does not exist', () => {
      const updatedEntity = updateEntityProperty(
        mockEntity,
        100,
        0,
        'memory_usage',
        '2023-01-01T11:00:00Z'
      );

      expect(updatedEntity.properties?.memory_usage?.currentValue).toBe(100);
      expect(updatedEntity.properties?.memory_usage?.name).toBe('memory_usage');
      expect(updatedEntity.properties?.memory_usage?.history).toHaveLength(1);
    });

    it('creates properties object if it does not exist', () => {
      const entityWithoutProperties: Entity = {
        id: 'test-entity',
        type: 'System',
        lastSeen: '2023-01-01T10:00:00Z',
        changesToday: 0,
      };

      const updatedEntity = updateEntityProperty(
        entityWithoutProperties,
        100,
        0,
        'cpu_usage',
        '2023-01-01T11:00:00Z'
      );

      expect(updatedEntity.properties).toBeDefined();
      expect(updatedEntity.properties?.cpu_usage?.currentValue).toBe(100);
    });
  });

  describe('updateEntityInList', () => {
    const mockEntities: Entity[] = [
      {
        id: 'entity-1',
        type: 'System',
        lastSeen: '2023-01-01T10:00:00Z',
        changesToday: 0,
      },
      {
        id: 'entity-2',
        type: 'System',
        lastSeen: '2023-01-01T10:00:00Z',
        changesToday: 0,
      },
    ];

    it('updates the correct entity in the list', () => {
      const updateFunction = (entity: Entity): Entity => ({
        ...entity,
        changesToday: entity.changesToday + 1,
      });

      const updatedEntities = updateEntityInList(
        'entity-1',
        mockEntities,
        updateFunction
      );

      expect(updatedEntities[0].changesToday).toBe(1);
      expect(updatedEntities[1].changesToday).toBe(0);
    });

    it('returns unchanged list if entity not found', () => {
      const updateFunction = (entity: Entity): Entity => ({
        ...entity,
        changesToday: entity.changesToday + 1,
      });

      const updatedEntities = updateEntityInList(
        'entity-3',
        mockEntities,
        updateFunction
      );

      expect(updatedEntities).toEqual(mockEntities);
    });
  });

  describe('getEntityName', () => {
    it('returns mapped names for known entity IDs', () => {
      expect(getEntityName('system-001')).toBe('Production Server Alpha');
      expect(getEntityName('ai-agent-001')).toBe('Threat Detection AI');
      expect(getEntityName('threat-001')).toBe('Suspicious Activity Detected');
      expect(getEntityName('network-node-001')).toBe('Core Router Alpha');
      expect(getEntityName('user-001')).toBe('Admin User');
    });

    it('returns entity ID for unknown entity IDs', () => {
      expect(getEntityName('unknown-entity')).toBe('unknown-entity');
    });
  });
});
