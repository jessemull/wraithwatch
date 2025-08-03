import { transformDatabaseDataToEntities } from '../entity-transformer';

describe('transformDatabaseDataToEntities', () => {
  it('transforms basic dbData correctly', () => {
    const input = [
      {
        entity_id: 'e1',
        property_name: 'status',
        value: 'online',
        timestamp: '2023-08-01T10:00:00Z',
        entity_type: 'Device',
      },
    ];

    const result = transformDatabaseDataToEntities(input);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 'e1',
      name: 'e1',
      type: 'Device',
      properties: {
        status: {
          name: 'status',
          currentValue: 'online',
          lastChanged: '2023-08-01T10:00:00Z',
          history: [],
        },
      },
      lastSeen: '2023-08-01T10:00:00Z',
      changesToday: 0,
    });
  });

  it('handles different key casing (camelCase)', () => {
    const input = [
      {
        entityId: 'e2',
        propertyName: 'status',
        value: 'offline',
        TTL: '2023-08-01T12:00:00Z',
        entity_type: 'Sensor',
      },
    ];

    const result = transformDatabaseDataToEntities(input);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('e2');
    expect(result[0].type).toBe('Sensor');
    expect(result[0].properties.status.currentValue).toBe('offline');
    expect(result[0].properties.status.lastChanged).toBe(
      '2023-08-01T12:00:00Z'
    );
    expect(result[0].lastSeen).toBe('2023-08-01T12:00:00Z');
  });

  it('handles multiple properties for same entity', () => {
    const input = [
      {
        entity_id: 'e3',
        property_name: 'battery',
        value: 80,
        timestamp: '2023-08-01T13:00:00Z',
      },
      {
        entity_id: 'e3',
        property_name: 'status',
        value: 'charging',
        timestamp: '2023-08-01T14:00:00Z',
      },
    ];

    const result = transformDatabaseDataToEntities(input);
    expect(result).toHaveLength(1);
    expect(Object.keys(result[0].properties)).toHaveLength(2);
    expect(result[0].properties.battery.currentValue).toBe(80);
    expect(result[0].properties.status.currentValue).toBe('charging');
  });

  it('updates existing property instead of creating new one', () => {
    const input = [
      {
        entity_id: 'e4',
        property_name: 'status',
        value: 'offline',
        timestamp: '2023-08-01T10:00:00Z',
      },
      {
        entity_id: 'e4',
        property_name: 'status',
        value: 'online',
        timestamp: '2023-08-01T11:00:00Z',
      },
    ];

    const result = transformDatabaseDataToEntities(input);
    expect(result).toHaveLength(1);
    const property = result[0].properties.status;
    expect(property.currentValue).toBe('online');
    expect(property.lastChanged).toBe('2023-08-01T11:00:00Z');
  });

  it('defaults entity_type to Unknown and generates timestamp if missing', () => {
    const input = [
      {
        entity_id: 'e5',
        property_name: 'status',
        value: 'unknown',
      },
    ];

    const before = new Date();
    const result = transformDatabaseDataToEntities(input);
    const after = new Date();

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('Unknown');

    const ts = new Date(result[0].properties.status.lastChanged);
    expect(ts.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(ts.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('handles empty input array', () => {
    const result = transformDatabaseDataToEntities([]);
    expect(result).toEqual([]);
  });
});
