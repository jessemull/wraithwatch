import { EntityChange } from '../types/api';

// Helper function to generate hash for entity distribution
function generateEntityHash(entityId: string): string {
  return entityId
    .split('')
    .reduce((hash, char) => {
      return ((hash << 5) - hash + char.charCodeAt(0)) & 0xffffffff;
    }, 0)
    .toString(16)
    .substring(0, 8);
}

// Helper function to generate time bucket (YYYY-MM-DD-HH)
function generateTimeBucket(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toISOString().slice(0, 13).replace('T', '-');
}

// Helper function to generate random value within range
function randomValue(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

// Helper function to generate change type
function generateChangeType(
  newValue: number,
  previousValue: number
): 'increase' | 'decrease' | 'change' {
  if (typeof newValue === 'number' && typeof previousValue === 'number') {
    return newValue > previousValue ? 'increase' : 'decrease';
  }
  return 'change';
}

// Generate mock data for a specific entity with better distribution
function generateEntityChanges(
  entityId: string,
  entityType: string,
  entityName: string,
  eventCount: number,
  startTime: Date,
  endTime: Date,
  properties: Record<string, { min: number; max: number; initialValue: number }>
): EntityChange[] {
  const changes: EntityChange[] = [];
  const entityHash = generateEntityHash(entityId);
  const timeSpan = endTime.getTime() - startTime.getTime();

  // Create truly random timestamps across the entire timeline
  const timestamps: Date[] = [];
  for (let i = 0; i < eventCount; i++) {
    // Generate random timestamp across the entire time span
    const randomTime = startTime.getTime() + Math.random() * timeSpan;
    timestamps.push(new Date(randomTime));
  }

  // Sort timestamps to ensure chronological order
  timestamps.sort((a, b) => a.getTime() - b.getTime());

  for (let i = 0; i < eventCount; i++) {
    const timestamp = timestamps[i];
    const timestampStr = timestamp.toISOString().replace('Z', '-07:00');
    const ttl = Math.floor(timestamp.getTime() / 1000) + 30 * 24 * 60 * 60;
    const timeBucket = generateTimeBucket(timestampStr);

    // Randomly select a property to change
    const propertyNames = Object.keys(properties);
    const propertyName =
      propertyNames[Math.floor(Math.random() * propertyNames.length)];
    const property = properties[propertyName];

    // Generate new value
    const previousValue = property.initialValue;
    const newValue = randomValue(property.min, property.max);

    const change: EntityChange = {
      entity_type: entityType,
      timestamp: timestampStr,
      TTL: ttl,
      property_name: propertyName,
      GSI1SK: `${timestampStr}#${entityId}#${propertyName}`,
      previous_value: previousValue,
      GSI2SK: `${timestampStr}#${entityId}#${propertyName}`,
      GSI2PK: `TIME_BUCKET#${timeBucket}`,
      GSI1PK: `ENTITY_HASH#${entityHash}`,
      value: newValue,
      entity_id: entityId,
      SK: `${timestampStr}#${propertyName}`,
      change_type: generateChangeType(newValue, previousValue),
      PK: `ENTITY#${entityId}`,
    };

    changes.push(change);

    // Update initial value for next iteration
    property.initialValue = newValue;
  }

  return changes;
}

// Generate all mock data with better distribution
export function generateMockEntityChanges(): EntityChange[] {
  const startTime = new Date('2025-07-25T00:00:00.000-07:00'); // One week ago
  const endTime = new Date('2025-08-01T23:59:59.999-07:00'); // Today

  const allChanges: EntityChange[] = [];

  // Systems (5 entities) - distributed across entire timeline
  const systems = [
    {
      id: 'system-001',
      name: 'Production Server Alpha',
      pattern: 'uniform' as const,
    },
    {
      id: 'system-002',
      name: 'Database Server Beta',
      pattern: 'burst' as const,
    },
    {
      id: 'system-003',
      name: 'Load Balancer Gamma',
      pattern: 'sparse' as const,
    },
    {
      id: 'system-004',
      name: 'Development Server Delta',
      pattern: 'uniform' as const,
    },
    {
      id: 'system-005',
      name: 'Analytics Server Epsilon',
      pattern: 'burst' as const,
    },
  ];

  systems.forEach(system => {
    const changes = generateEntityChanges(
      system.id,
      'System',
      system.name,
      Math.floor(Math.random() * 101) + 100, // 100-200 events
      startTime,
      endTime,
      {
        cpu_usage: { min: 10, max: 95, initialValue: 45 },
        memory_usage: { min: 20, max: 90, initialValue: 60 },
        network_connections: { min: 50, max: 2000, initialValue: 500 },
        disk_usage: { min: 30, max: 85, initialValue: 55 },
        response_time: { min: 10, max: 500, initialValue: 50 },
      }
    );
    allChanges.push(...changes);
  });

  // AI Agents (4 entities) - distributed across entire timeline
  const aiAgents = [
    {
      id: 'ai-agent-001',
      name: 'Threat Detection AI',
      pattern: 'uniform' as const,
    },
    {
      id: 'ai-agent-002',
      name: 'Network Analysis AI',
      pattern: 'burst' as const,
    },
    {
      id: 'ai-agent-003',
      name: 'Performance Monitor AI',
      pattern: 'sparse' as const,
    },
    {
      id: 'ai-agent-004',
      name: 'Anomaly Detection AI',
      pattern: 'uniform' as const,
    },
  ];

  aiAgents.forEach(agent => {
    const changes = generateEntityChanges(
      agent.id,
      'AI_Agent',
      agent.name,
      Math.floor(Math.random() * 101) + 100, // 100-200 events
      startTime,
      endTime,
      {
        confidence_score: { min: 0.5, max: 0.99, initialValue: 0.8 },
        response_time: { min: 20, max: 300, initialValue: 100 },
        active_requests: { min: 5, max: 500, initialValue: 50 },
        accuracy: { min: 0.7, max: 0.98, initialValue: 0.85 },
      }
    );
    allChanges.push(...changes);
  });

  // Threats (4 entities) - distributed across entire timeline
  const threats = [
    {
      id: 'threat-001',
      name: 'Critical DDoS Attack',
      level: 'high',
      pattern: 'burst' as const,
    },
    {
      id: 'threat-002',
      name: 'Minor Suspicious Activity',
      level: 'low',
      pattern: 'sparse' as const,
    },
    {
      id: 'threat-003',
      name: 'Data Exfiltration Attempt',
      level: 'medium',
      pattern: 'uniform' as const,
    },
    {
      id: 'threat-004',
      name: 'Malware Detection',
      level: 'high',
      pattern: 'burst' as const,
    },
  ];

  threats.forEach(threat => {
    const threatScoreRange =
      threat.level === 'high'
        ? { min: 0.7, max: 0.99, initialValue: 0.85 }
        : threat.level === 'medium'
          ? { min: 0.4, max: 0.7, initialValue: 0.55 }
          : { min: 0.1, max: 0.4, initialValue: 0.25 };

    const changes = generateEntityChanges(
      threat.id,
      'Threat',
      threat.name,
      Math.floor(Math.random() * 101) + 100, // 100-200 events
      startTime,
      endTime,
      {
        threat_score: threatScoreRange,
        detection_count: { min: 1, max: 100, initialValue: 10 },
        severity: {
          min: 0.1,
          max: 0.9,
          initialValue:
            threat.level === 'high'
              ? 0.8
              : threat.level === 'medium'
                ? 0.5
                : 0.3,
        },
      }
    );
    allChanges.push(...changes);
  });

  // Network Nodes (4 entities) - distributed across entire timeline
  const networkNodes = [
    {
      id: 'network-node-001',
      name: 'Core Router',
      pattern: 'uniform' as const,
    },
    { id: 'network-node-002', name: 'Edge Switch', pattern: 'burst' as const },
    {
      id: 'network-node-003',
      name: 'Backup Router',
      pattern: 'sparse' as const,
    },
    {
      id: 'network-node-004',
      name: 'DMZ Gateway',
      pattern: 'uniform' as const,
    },
  ];

  networkNodes.forEach(node => {
    const changes = generateEntityChanges(
      node.id,
      'Network_Node',
      node.name,
      Math.floor(Math.random() * 101) + 100, // 100-200 events
      startTime,
      endTime,
      {
        bandwidth_usage: { min: 100, max: 2000, initialValue: 800 },
        connection_count: { min: 10, max: 500, initialValue: 100 },
        latency: { min: 1, max: 200, initialValue: 50 },
        packet_loss: { min: 0, max: 10, initialValue: 2 },
      }
    );
    allChanges.push(...changes);
  });

  // Users (4 entities) - distributed across entire timeline
  const users = [
    { id: 'user-001', name: 'Admin User', pattern: 'uniform' as const },
    { id: 'user-002', name: 'Developer User', pattern: 'burst' as const },
    { id: 'user-003', name: 'Analyst User', pattern: 'sparse' as const },
    { id: 'user-004', name: 'Guest User', pattern: 'sparse' as const },
  ];

  users.forEach(user => {
    const changes = generateEntityChanges(
      user.id,
      'User',
      user.name,
      Math.floor(Math.random() * 101) + 100, // 100-200 events
      startTime,
      endTime,
      {
        login_count: { min: 0, max: 50, initialValue: 5 },
        session_duration: { min: 0, max: 480, initialValue: 120 },
        failed_login_attempts: { min: 0, max: 10, initialValue: 1 },
      }
    );
    allChanges.push(...changes);
  });

  return allChanges;
}

// Export the mock data
export const mockEntityChanges = generateMockEntityChanges();
