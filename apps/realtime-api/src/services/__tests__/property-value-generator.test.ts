import { PropertyValueGenerator } from '../property-value-generator';
import * as constants from '../../constants/property-config';

jest.mock('../../constants/property-config', () => ({
  VALUE_RANGES: {
    CPU_USAGE: { min: 10, max: 90 },
    MEMORY_USAGE: { min: 100, max: 800 },
    NETWORK_CONNECTIONS: { min: 1, max: 10 },
    DISK_USAGE: { min: 20, max: 70 },
    RESPONSE_TIME: { min: 50, max: 200 },
    CONFIDENCE_SCORE: { min: 0.5, max: 1.0 },
    ACTIVE_REQUESTS: { min: 0, max: 5 },
    ACCURACY: { min: 0.7, max: 0.99 },
    THREAT_SCORE: { min: 0, max: 10 },
    DETECTION_COUNT: { min: 0, max: 100 },
    BANDWIDTH_USAGE: { min: 100, max: 1000 },
    CONNECTION_COUNT: { min: 1, max: 50 },
    LATENCY: { min: 10, max: 300 },
    PACKET_LOSS: { max: 1 },
    ERROR_RATE: { max: 0.5 },
    LOGIN_COUNT: { max: 30 },
    SESSION_DURATION: { max: 3600 },
    FAILED_LOGIN_ATTEMPTS: { max: 5 },
    TEMPERATURE: { min: -10, max: 50 },
    HUMIDITY: { min: 10, max: 90 },
    BATTERY: { max: 100 },
  },
  STATUS_VALUES: {
    AI_AGENT: ['idle', 'training', 'active'],
    DEFAULT: ['ok', 'degraded', 'down'],
    MODEL_VERSIONS: ['v1', 'v2'],
    TRAINING: ['queued', 'running', 'complete'],
    SEVERITY: ['low', 'medium', 'high'],
    SOURCE_IPS: ['192.168.1.1', '10.0.0.1'],
    ATTACK_TYPES: ['phishing', 'malware'],
    MITIGATION: ['in-progress', 'complete'],
    ROUTING: ['optimal', 'suboptimal'],
    ACTIVITY: ['login', 'logout'],
    PERMISSION: ['admin', 'user'],
  },
  PROPERTY_CHANGE_FREQUENCIES: {
    cpu_usage: 0.5,
    accuracy: 0.9,
  },
  ENTITY_TYPE_PROPERTIES: {
    Agent: ['cpu_usage', 'accuracy'],
    Sensor: ['temperature', 'humidity'],
  },
}));

describe('PropertyValueGenerator', () => {
  const generator = new PropertyValueGenerator();

  const testProperty = (name: string, entityType = 'Agent') => {
    const value = generator.generatePropertyValue(name, 'fallback', entityType);
    expect(value).not.toBeUndefined();
    expect(value).not.toBe('fallback');
  };

  it('generates values for all known properties', () => {
    const allProps = [
      'cpu_usage',
      'memory_usage',
      'network_connections',
      'disk_usage',
      'response_time',
      'status',
      'confidence_score',
      'active_requests',
      'model_version',
      'accuracy',
      'training_status',
      'threat_score',
      'severity',
      'detection_count',
      'source_ip',
      'attack_type',
      'mitigation_status',
      'bandwidth_usage',
      'connection_count',
      'latency',
      'packet_loss',
      'error_rate',
      'login_count',
      'last_activity',
      'session_duration',
      'permission_level',
      'failed_login_attempts',
      'temperature',
      'humidity',
      'battery',
    ];

    allProps.forEach(prop => testProperty(prop));
  });

  it('returns AI_AGENT status when entityType is AI_Agent', () => {
    const value = generator.generatePropertyValue(
      'status',
      'fallback',
      'AI_Agent'
    );
    expect(constants.STATUS_VALUES.AI_AGENT).toContain(value);
  });

  it('returns default value for unknown property', () => {
    const fallback = 'original';
    const value = generator.generatePropertyValue(
      'unknown_prop',
      fallback,
      'Agent'
    );
    expect(value).toBe(fallback);
  });

  describe('getPropertyChangeFrequency', () => {
    it('returns specific frequency if defined', () => {
      expect(generator.getPropertyChangeFrequency('cpu_usage')).toBe(0.5);
    });

    it('returns default frequency for unknown property', () => {
      expect(generator.getPropertyChangeFrequency('nonexistent')).toBe(0.2);
    });
  });

  describe('getAllowedPropertiesForEntityType', () => {
    it('returns properties for known entity type', () => {
      expect(generator.getAllowedPropertiesForEntityType('Sensor')).toEqual([
        'temperature',
        'humidity',
      ]);
    });

    it('returns empty array for unknown entity type', () => {
      expect(generator.getAllowedPropertiesForEntityType('Ghost')).toEqual([]);
    });
  });
});
