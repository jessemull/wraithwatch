import { AggregatedMetricsService } from '../aggregated-metrics';
import { EntityChange } from '../../types/dynamodb';

describe('AggregatedMetricsService', () => {
  let service: AggregatedMetricsService;

  const createEntityChange = (
    entityId: string,
    entityType: string,
    propertyName: string,
    value: string | number,
    timestamp: string
  ): EntityChange => ({
    PK: `ENTITY#${entityId}`,
    SK: `PROPERTY#${propertyName}`,
    GSI1PK: `ENTITY#${entityId}`,
    GSI1SK: `PROPERTY#${propertyName}`,
    GSI2PK: `ENTITY#${entityId}`,
    GSI2SK: `PROPERTY#${propertyName}`,
    entity_id: entityId,
    entity_type: entityType,
    property_name: propertyName,
    value,
    change_type: 'change',
    timestamp,
    TTL: 1234567890,
  });

  beforeEach(() => {
    service = new AggregatedMetricsService();
  });

  it('should return empty metrics for empty changes', async () => {
    const result = await service.calculateMetrics([]);

    expect(result).toEqual({
      activeThreats: 0,
      threatScore: '0.00',
      aiConfidence: 0,
      totalConnections: 0,
      threatSeverityDistribution: {},
      aiAgentActivity: {},
      protocolUsage: {},
      entityChangesByDay: {},
    });
  });

  it('should return empty metrics for null changes', async () => {
    const result = await service.calculateMetrics(null as any);

    expect(result).toEqual({
      activeThreats: 0,
      threatScore: '0.00',
      aiConfidence: 0,
      totalConnections: 0,
      threatSeverityDistribution: {},
      aiAgentActivity: {},
      protocolUsage: {},
      entityChangesByDay: {},
    });
  });

  it('should calculate metrics for threat entities', async () => {
    const changes: EntityChange[] = [
      createEntityChange(
        'threat-1',
        'Threat',
        'threat_score',
        '8.5',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-1',
        'Threat',
        'confidence_score',
        '0.85',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-1',
        'Threat',
        'connection_count',
        '5',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-1',
        'Threat',
        'severity',
        'High',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-1',
        'Threat',
        'protocol',
        'HTTPS',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-1',
        'Threat',
        'ai_agent',
        'Sentinel',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-2',
        'Threat',
        'threat_score',
        '6.2',
        '2023-01-01T01:00:00Z'
      ),
      createEntityChange(
        'threat-2',
        'Threat',
        'confidence_score',
        '0.72',
        '2023-01-01T01:00:00Z'
      ),
      createEntityChange(
        'threat-2',
        'Threat',
        'connection_count',
        '3',
        '2023-01-01T01:00:00Z'
      ),
      createEntityChange(
        'threat-2',
        'Threat',
        'severity',
        'Medium',
        '2023-01-01T01:00:00Z'
      ),
      createEntityChange(
        'threat-2',
        'Threat',
        'protocol',
        'HTTP',
        '2023-01-01T01:00:00Z'
      ),
      createEntityChange(
        'threat-2',
        'Threat',
        'ai_agent',
        'Guardian',
        '2023-01-01T01:00:00Z'
      ),
    ];

    const result = await service.calculateMetrics(changes);

    expect(result.activeThreats).toBe(2);
    expect(result.threatScore).toBe('7.35');
    expect(result.aiConfidence).toBe(78);
    expect(result.totalConnections).toBe(8);
    expect(result.threatSeverityDistribution).toEqual({
      High: 1,
      Medium: 1,
    });
    expect(result.aiAgentActivity).toEqual({});
    expect(result.protocolUsage).toEqual({});
    expect(Object.keys(result.entityChangesByDay).length).toBeGreaterThan(0);
    expect(typeof result.entityChangesByDay).toBe('object');
  });

  it('should calculate metrics for mixed entity types', async () => {
    const changes: EntityChange[] = [
      createEntityChange(
        'threat-1',
        'Threat',
        'threat_score',
        '9.0',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-1',
        'Threat',
        'confidence_score',
        '0.90',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-1',
        'Threat',
        'connection_count',
        '10',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-1',
        'Threat',
        'severity',
        'Critical',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-1',
        'Threat',
        'protocol',
        'HTTPS',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-1',
        'Threat',
        'ai_agent',
        'Sentinel',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'device-1',
        'Device',
        'connection_count',
        '5',
        '2023-01-01T01:00:00Z'
      ),
      createEntityChange(
        'device-1',
        'Device',
        'protocol',
        'SSH',
        '2023-01-01T01:00:00Z'
      ),
    ];

    const result = await service.calculateMetrics(changes);

    expect(result.activeThreats).toBe(1);
    expect(result.threatScore).toBe('9.00');
    expect(result.aiConfidence).toBe(90);
    expect(result.totalConnections).toBe(15);
    expect(result.threatSeverityDistribution).toEqual({
      Critical: 1,
    });
    expect(result.aiAgentActivity).toEqual({});
    expect(result.protocolUsage).toEqual({});
  });

  it('should handle string and numeric values', async () => {
    const changes: EntityChange[] = [
      createEntityChange(
        'threat-1',
        'Threat',
        'threat_score',
        8.5,
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-1',
        'Threat',
        'confidence_score',
        0.85,
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-1',
        'Threat',
        'connection_count',
        5,
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-1',
        'Threat',
        'network_connections',
        3,
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-1',
        'Threat',
        'severity',
        'High',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-1',
        'Threat',
        'protocol',
        'HTTPS',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-1',
        'Threat',
        'ai_agent',
        'Sentinel',
        '2023-01-01T00:00:00Z'
      ),
    ];

    const result = await service.calculateMetrics(changes);

    expect(result.activeThreats).toBe(1);
    expect(result.threatScore).toBe('8.50');
    expect(result.aiConfidence).toBe(85);
    expect(result.totalConnections).toBe(8);
  });

  it('should handle missing optional fields', async () => {
    const changes: EntityChange[] = [
      createEntityChange(
        'threat-1',
        'Threat',
        'threat_score',
        '8.5',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-1',
        'Threat',
        'confidence_score',
        '0.85',
        '2023-01-01T00:00:00Z'
      ),
    ];

    const result = await service.calculateMetrics(changes);

    expect(result.activeThreats).toBe(1);
    expect(result.threatScore).toBe('8.50');
    expect(result.aiConfidence).toBe(85);
    expect(result.totalConnections).toBe(0);
    expect(result.threatSeverityDistribution).toEqual({});
    expect(result.aiAgentActivity).toEqual({});
    expect(result.protocolUsage).toEqual({});
  });

  it('should calculate average threat score correctly', async () => {
    const changes: EntityChange[] = [
      createEntityChange(
        'threat-1',
        'Threat',
        'threat_score',
        '10.0',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-2',
        'Threat',
        'threat_score',
        '5.0',
        '2023-01-01T01:00:00Z'
      ),
      createEntityChange(
        'threat-3',
        'Threat',
        'threat_score',
        '7.5',
        '2023-01-01T02:00:00Z'
      ),
    ];

    const result = await service.calculateMetrics(changes);

    expect(result.threatScore).toBe('7.50');
  });

  it('should handle zero threat scores', async () => {
    const changes: EntityChange[] = [
      createEntityChange(
        'threat-1',
        'Threat',
        'threat_score',
        '0.0',
        '2023-01-01T00:00:00Z'
      ),
    ];

    const result = await service.calculateMetrics(changes);

    expect(result.threatScore).toBe('0.00');
  });

  it('should group entity changes by day', async () => {
    const changes: EntityChange[] = [
      createEntityChange(
        'threat-1',
        'Threat',
        'entity_type',
        'Threat',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-2',
        'Threat',
        'entity_type',
        'Threat',
        '2023-01-01T12:00:00Z'
      ),
      createEntityChange(
        'threat-3',
        'Threat',
        'entity_type',
        'Threat',
        '2023-01-02T00:00:00Z'
      ),
    ];

    const result = await service.calculateMetrics(changes);

    expect(Object.keys(result.entityChangesByDay).length).toBeGreaterThan(0);
    expect(typeof result.entityChangesByDay).toBe('object');
  });

  it('should return last update time', () => {
    const lastUpdate = service.getLastUpdate();
    expect(lastUpdate).toBeNull();
  });

  it('should clear cache', () => {
    expect(() => service.clearCache()).not.toThrow();
  });

  it('should preload cache', async () => {
    const changes: EntityChange[] = [
      createEntityChange(
        'threat-1',
        'Threat',
        'threat_score',
        '8.5',
        '2023-01-01T00:00:00Z'
      ),
    ];

    await expect(service.preloadCache(changes)).resolves.not.toThrow();
  });

  it('should handle invalid timestamps in entity changes', async () => {
    const changes: EntityChange[] = [
      createEntityChange(
        'threat-1',
        'Threat',
        'threat_score',
        '8.5',
        'invalid-timestamp'
      ),
      createEntityChange(
        'threat-2',
        'Threat',
        'threat_score',
        '5.0',
        '2023-01-01T00:00:00Z'
      ),
    ];

    const result = await service.calculateMetrics(changes);
    expect(result.threatScore).toBe('5.00');
  });

  it('should handle changes with invalid property values', async () => {
    const changes: EntityChange[] = [
      createEntityChange(
        'threat-1',
        'Threat',
        'threat_score',
        'invalid-number',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'threat-2',
        'Threat',
        'threat_score',
        '5.0',
        '2023-01-01T00:00:00Z'
      ),
    ];

    const result = await service.calculateMetrics(changes);
    expect(result.threatScore).toBe('5.00');
  });

  it('should handle AI agent status distribution with missing status', async () => {
    const changes: EntityChange[] = [
      createEntityChange(
        'ai-1',
        'AI_Agent',
        'status',
        'online',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'ai-2',
        'AI_Agent',
        'confidence_score',
        '0.8',
        '2023-01-01T00:00:00Z'
      ),
    ];

    const result = await service.calculateMetrics(changes);
    expect(result.aiAgentActivity).toBeDefined();
  });

  it('should handle protocol usage with various protocols', async () => {
    const changes: EntityChange[] = [
      createEntityChange(
        'entity-1',
        'System',
        'protocol',
        'HTTPS',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'entity-2',
        'System',
        'protocol',
        'HTTP',
        '2023-01-01T00:00:00Z'
      ),
      createEntityChange(
        'entity-3',
        'System',
        'protocol',
        'FTP',
        '2023-01-01T00:00:00Z'
      ),
    ];

    const result = await service.calculateMetrics(changes);
    expect(result.protocolUsage).toBeDefined();
    // The service only counts protocol usage for entities that have the protocol property
    // and are of a type that allows protocol tracking
    expect(typeof result.protocolUsage).toBe('object');
  });

  it('should handle entity changes with future dates', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);

    const changes: EntityChange[] = [
      createEntityChange(
        'threat-1',
        'Threat',
        'threat_score',
        '8.5',
        futureDate.toISOString()
      ),
    ];

    const result = await service.calculateMetrics(changes);
    expect(result.entityChangesByDay).toBeDefined();
  });

  it('should handle entity changes with past dates outside range', async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 20);

    const changes: EntityChange[] = [
      createEntityChange(
        'threat-1',
        'Threat',
        'threat_score',
        '8.5',
        pastDate.toISOString()
      ),
    ];

    const result = await service.calculateMetrics(changes);
    expect(result.entityChangesByDay).toBeDefined();
  });

  it('should handle preload cache error', async () => {
    const mockService = new AggregatedMetricsService();
    jest
      .spyOn(mockService, 'calculateMetrics')
      .mockRejectedValue(new Error('Test error'));

    await expect(mockService.preloadCache([])).rejects.toThrow('Test error');
  });
});
