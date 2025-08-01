import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { subDays, format } from 'date-fns';
import { createHash } from 'crypto';

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

interface EntityChange {
  PK: string;
  SK: string;
  GSI1PK: string; // Entity Hash for diverse queries
  GSI1SK: string; // Timestamp + Entity + Property
  GSI2PK: string; // Time Bucket for time-based queries
  GSI2SK: string; // Timestamp + Entity + Property
  entity_id: string;
  entity_type: string;
  property_name: string;
  value: string | number;
  previous_value?: string | number;
  change_type: 'increase' | 'decrease' | 'change';
  timestamp: string;
  TTL: number;
}

// Helper function to generate hash for entity distribution
function generateEntityHash(entityId: string): string {
  return createHash('md5').update(entityId).digest('hex').substring(0, 8);
}

// Helper function to generate time bucket (YYYY-MM-DD-HH)
function generateTimeBucket(timestamp: string): string {
  const date = new Date(timestamp);
  return format(date, 'yyyy-MM-dd-HH');
}

// Property configuration types...

interface NumericConfig {
  min: number;
  max: number;
  changeRate: number;
  volatility?: number; // How much the value can change
}

interface EnumConfig {
  values: string[];
  changeRate: number;
}

type PropertyConfig = NumericConfig | EnumConfig;

interface EntityConfig {
  id: string;
  type: string;
  name: string;
  characteristics: {
    load?: 'high' | 'medium' | 'low';
    criticality?: 'critical' | 'high' | 'medium' | 'low';
    specialization?: string;
    accuracy?: 'high' | 'medium' | 'low';
    severity?: 'critical' | 'high' | 'medium' | 'low';
    persistence?: 'high' | 'medium' | 'low';
    role?: string;
    traffic?: 'high' | 'medium' | 'low';
    activity?: 'high' | 'medium' | 'low' | 'very_low';
  };
}

// Function to get property config based on entity characteristics
function getPropertyConfig(
  entityType: string,
  entity: EntityConfig
): Record<string, PropertyConfig> {
  const baseConfigs = {
    System: {
      cpu_usage: { min: 10, max: 95, changeRate: 0.8, volatility: 0.15 },
      memory_usage: { min: 20, max: 90, changeRate: 0.6, volatility: 0.12 },
      network_connections: {
        min: 50,
        max: 2000,
        changeRate: 0.9,
        volatility: 0.2,
      },
      disk_usage: { min: 30, max: 85, changeRate: 0.3, volatility: 0.05 },
      response_time: { min: 10, max: 500, changeRate: 0.7, volatility: 0.25 },
      status: {
        values: [
          'online',
          'offline',
          'maintenance',
          'degraded',
          'overloaded',
          'recovering',
        ],
        changeRate: 0.02,
      },
    },
    AI_Agent: {
      confidence_score: {
        min: 0.5,
        max: 0.99,
        changeRate: 0.5,
        volatility: 0.1,
      },
      response_time: { min: 20, max: 300, changeRate: 0.6, volatility: 0.2 },
      active_requests: { min: 5, max: 500, changeRate: 0.8, volatility: 0.3 },
      model_version: {
        values: ['v1.2.3', 'v1.2.4', 'v1.3.0', 'v1.3.1', 'v1.4.0'],
        changeRate: 0.01,
      },
      accuracy: { min: 0.7, max: 0.98, changeRate: 0.4, volatility: 0.08 },
      training_status: {
        values: ['idle', 'training', 'evaluating', 'deploying', 'failed'],
        changeRate: 0.05,
      },
    },
    Threat: {
      threat_score: { min: 0.1, max: 0.95, changeRate: 0.3, volatility: 0.15 },
      severity: {
        values: ['low', 'medium', 'high', 'critical', 'emergency'],
        changeRate: 0.1,
      },
      detection_count: { min: 1, max: 100, changeRate: 0.4, volatility: 0.2 },
      source_ip: {
        values: [
          '192.168.1.100',
          '10.0.0.50',
          '172.16.0.25',
          '203.0.113.45',
          '198.51.100.123',
        ],
        changeRate: 0.05,
      },
      attack_type: {
        values: [
          'ddos',
          'malware',
          'phishing',
          'sql_injection',
          'xss',
          'brute_force',
        ],
        changeRate: 0.02,
      },
      mitigation_status: {
        values: [
          'detected',
          'investigating',
          'mitigating',
          'resolved',
          'false_positive',
        ],
        changeRate: 0.08,
      },
    },
    Network_Node: {
      bandwidth_usage: {
        min: 100,
        max: 2000,
        changeRate: 0.7,
        volatility: 0.25,
      },
      connection_count: { min: 10, max: 500, changeRate: 0.8, volatility: 0.3 },
      latency: { min: 1, max: 200, changeRate: 0.6, volatility: 0.2 },
      packet_loss: { min: 0, max: 10, changeRate: 0.4, volatility: 0.15 },
      error_rate: { min: 0, max: 5, changeRate: 0.3, volatility: 0.1 },
      routing_status: {
        values: ['optimal', 'congested', 'rerouting', 'failed', 'maintenance'],
        changeRate: 0.03,
      },
    },
    User: {
      login_count: { min: 0, max: 50, changeRate: 0.2, volatility: 0.1 },
      last_activity: {
        values: ['active', 'idle', 'away', 'offline', 'suspended', 'locked'],
        changeRate: 0.3,
      },
      session_duration: { min: 0, max: 480, changeRate: 0.4, volatility: 0.2 },
      permission_level: {
        values: ['guest', 'user', 'admin', 'super_admin', 'read_only'],
        changeRate: 0.01,
      },
      failed_login_attempts: {
        min: 0,
        max: 10,
        changeRate: 0.1,
        volatility: 0.05,
      },
    },
  };

  const config = {
    ...baseConfigs[entityType as keyof typeof baseConfigs],
  } as Record<string, PropertyConfig>;

  // Adjust configs based on entity characteristics
  if (entityType === 'System') {
    if (entity.characteristics.load === 'high') {
      const systemConfig = config as Record<string, PropertyConfig>;
      systemConfig.cpu_usage = {
        ...systemConfig.cpu_usage,
        min: 40,
        max: 98,
        changeRate: 0.9,
      };
      systemConfig.memory_usage = {
        ...systemConfig.memory_usage,
        min: 50,
        max: 95,
        changeRate: 0.8,
      };
    } else if (entity.characteristics.load === 'low') {
      const systemConfig = config as Record<string, PropertyConfig>;
      systemConfig.cpu_usage = {
        ...systemConfig.cpu_usage,
        min: 5,
        max: 60,
        changeRate: 0.4,
      };
      systemConfig.memory_usage = {
        ...systemConfig.memory_usage,
        min: 15,
        max: 70,
        changeRate: 0.3,
      };
    }
  } else if (entityType === 'AI_Agent') {
    if (entity.characteristics.accuracy === 'high') {
      const aiConfig = config as Record<string, PropertyConfig>;
      aiConfig.confidence_score = {
        ...aiConfig.confidence_score,
        min: 0.8,
        max: 0.99,
      };
      aiConfig.accuracy = { ...aiConfig.accuracy, min: 0.9, max: 0.98 };
    } else if (entity.characteristics.accuracy === 'low') {
      const aiConfig = config as Record<string, PropertyConfig>;
      aiConfig.confidence_score = {
        ...aiConfig.confidence_score,
        min: 0.3,
        max: 0.7,
      };
      aiConfig.accuracy = { ...aiConfig.accuracy, min: 0.5, max: 0.8 };
    }
  } else if (entityType === 'Threat') {
    if (entity.characteristics.severity === 'critical') {
      const threatConfig = config as Record<string, PropertyConfig>;
      threatConfig.threat_score = {
        ...threatConfig.threat_score,
        min: 0.7,
        max: 0.99,
        changeRate: 0.5,
      };
      threatConfig.severity = {
        ...threatConfig.severity,
        values: ['high', 'critical', 'emergency'],
      };
    } else if (entity.characteristics.severity === 'low') {
      const threatConfig = config as Record<string, PropertyConfig>;
      threatConfig.threat_score = {
        ...threatConfig.threat_score,
        min: 0.1,
        max: 0.4,
        changeRate: 0.1,
      };
      threatConfig.severity = {
        ...threatConfig.severity,
        values: ['low', 'medium'],
      };
    }
  } else if (entityType === 'Network_Node') {
    if (entity.characteristics.traffic === 'high') {
      const networkConfig = config as Record<string, PropertyConfig>;
      networkConfig.bandwidth_usage = {
        ...networkConfig.bandwidth_usage,
        min: 500,
        max: 3000,
        changeRate: 0.9,
      };
      networkConfig.connection_count = {
        ...networkConfig.connection_count,
        min: 100,
        max: 1000,
        changeRate: 0.9,
      };
    } else if (entity.characteristics.traffic === 'low') {
      const networkConfig = config as Record<string, PropertyConfig>;
      networkConfig.bandwidth_usage = {
        ...networkConfig.bandwidth_usage,
        min: 10,
        max: 500,
        changeRate: 0.3,
      };
      networkConfig.connection_count = {
        ...networkConfig.connection_count,
        min: 5,
        max: 100,
        changeRate: 0.4,
      };
    }
  } else if (entityType === 'User') {
    if (entity.characteristics.activity === 'high') {
      const userConfig = config as Record<string, PropertyConfig>;
      userConfig.login_count = {
        ...userConfig.login_count,
        min: 10,
        max: 100,
        changeRate: 0.4,
      };
      userConfig.last_activity = {
        ...userConfig.last_activity,
        values: ['active', 'idle'],
        changeRate: 0.5,
      };
    } else if (entity.characteristics.activity === 'very_low') {
      const userConfig = config as Record<string, PropertyConfig>;
      userConfig.login_count = {
        ...userConfig.login_count,
        min: 0,
        max: 5,
        changeRate: 0.05,
      };
      userConfig.last_activity = {
        ...userConfig.last_activity,
        values: ['away', 'offline'],
        changeRate: 0.1,
      };
    }
  }

  return config;
}

// Helper function to check if config is enum...

function isEnumConfig(config: PropertyConfig): config is EnumConfig {
  return 'values' in config;
}

function generateValue(
  config: PropertyConfig,
  previousValue?: string | number
): string | number {
  if (isEnumConfig(config)) {
    // For enum-like properties - truly random selection...

    const shouldChange = Math.random() < config.changeRate;
    if (!shouldChange && previousValue !== undefined) {
      return previousValue;
    }

    // Randomly select a value, potentially different from previous...

    const availableValues = config.values.filter(v => v !== previousValue);
    if (availableValues.length === 0) {
      return config.values[Math.floor(Math.random() * config.values.length)];
    }
    return availableValues[Math.floor(Math.random() * availableValues.length)];
  } else {
    // For numeric properties with volatility...

    const shouldChange = Math.random() < config.changeRate;
    if (!shouldChange && previousValue !== undefined) {
      return previousValue;
    }

    // Generate random value within range with volatility...
    let value: number;
    if (
      previousValue !== undefined &&
      typeof previousValue === 'number' &&
      config.volatility
    ) {
      // Change based on previous value and volatility
      const change =
        (Math.random() - 0.5) *
        2 *
        config.volatility *
        (config.max - config.min);
      value = Number(previousValue) + change;
    } else {
      // Initial random value
      value = Math.random() * (config.max - config.min) + config.min;
    }

    // Clamp to min/max range
    value = Math.max(config.min, Math.min(config.max, value));
    return Math.round(value * 100) / 100; // Round to 2 decimal places
  }
}

function generateChangeType(
  newValue: string | number,
  previousValue: string | number
): 'increase' | 'decrease' | 'change' {
  if (typeof newValue === 'number' && typeof previousValue === 'number') {
    return newValue > previousValue ? 'increase' : 'decrease';
  }
  return 'change';
}

async function generateTimeSeriesData(): Promise<EntityChange[]> {
  const changes: EntityChange[] = [];
  const startDate = subDays(new Date(), 7);
  const endDate = new Date();

  for (const entity of entities) {
    const config = getPropertyConfig(entity.type, entity);
    if (!config) continue;

    const properties = Object.keys(config);
    const currentValues: Record<string, string | number> = {};

    // Initialize current values with random starting points
    for (const prop of properties) {
      const propConfig = config[prop];
      if (isEnumConfig(propConfig)) {
        currentValues[prop] =
          propConfig.values[
            Math.floor(Math.random() * propConfig.values.length)
          ];
      } else {
        currentValues[prop] =
          Math.random() * (propConfig.max - propConfig.min) + propConfig.min;
        currentValues[prop] = Math.round(currentValues[prop] * 100) / 100;
      }
    }

    // Generate changes over time with the same distribution logic as client
    const timeSpan = endDate.getTime() - startDate.getTime();

    // Create truly random timestamps across the entire timeline (like client)
    const timestamps: Date[] = [];
    const eventCount = Math.floor(Math.random() * 101) + 100; // 100-200 events per entity

    for (let i = 0; i < eventCount; i++) {
      // Generate random timestamp across the entire time span
      const randomTime = startDate.getTime() + Math.random() * timeSpan;
      timestamps.push(new Date(randomTime));
    }

    // Sort timestamps to ensure chronological order
    timestamps.sort((a, b) => a.getTime() - b.getTime());

    for (let i = 0; i < eventCount; i++) {
      const currentTime = timestamps[i];

      // Randomly select a property to change (like client)
      const propertiesToCheck = properties.filter(() => Math.random() < 0.3);

      for (const prop of propertiesToCheck) {
        const propConfig = config[prop];
        const previousValue = currentValues[prop];
        const newValue = generateValue(propConfig, previousValue);

        if (newValue !== previousValue) {
          const timestamp = format(currentTime, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
          const ttl =
            Math.floor(currentTime.getTime() / 1000) + 30 * 24 * 60 * 60; // 30 days

          // Generate GSI fields
          const entityHash = generateEntityHash(entity.id);
          const timeBucket = generateTimeBucket(timestamp);
          const gsi1Sk = `${timestamp}#${entity.id}#${prop}`;
          const gsi2Sk = `${timestamp}#${entity.id}#${prop}`;

          changes.push({
            PK: `ENTITY#${entity.id}`,
            SK: `${timestamp}#${prop}`,
            GSI1PK: `ENTITY_HASH#${entityHash}`,
            GSI1SK: gsi1Sk,
            GSI2PK: `TIME_BUCKET#${timeBucket}`,
            GSI2SK: gsi2Sk,
            entity_id: entity.id,
            entity_type: entity.type,
            property_name: prop,
            value: newValue,
            previous_value: previousValue,
            change_type: generateChangeType(newValue, previousValue),
            timestamp,
            TTL: ttl,
          });

          currentValues[prop] = newValue;
        }
      }
    }
  }

  return changes;
}

async function loadDataToDynamoDB(changes: EntityChange[]): Promise<void> {
  const batchSize = 25; // DynamoDB batch write limit

  for (let i = 0; i < changes.length; i += batchSize) {
    const batch = changes.slice(i, i + batchSize);
    const writeRequests = batch.map(change => ({
      PutRequest: {
        Item: change,
      },
    }));

    try {
      await docClient.send(
        new BatchWriteCommand({
          RequestItems: {
            'wraithwatch-entity-changes': writeRequests,
          },
        })
      );
      console.log(
        `Loaded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(changes.length / batchSize)}`
      );
    } catch (error) {
      console.error('Error loading batch:', error);
    }
  }
}

async function main() {
  console.log('Generating time-series data...');
  const changes = await generateTimeSeriesData();
  console.log(`Generated ${changes.length} changes`);

  console.log('Loading data to DynamoDB...');
  await loadDataToDynamoDB(changes);
  console.log('Data loading complete!');
}

main().catch(console.error);

// Entity configurations...
const entities: EntityConfig[] = [
  // Systems with different characteristics
  {
    id: 'system-001',
    type: 'System',
    name: 'Production Server Alpha',
    characteristics: { load: 'high', criticality: 'critical' },
  },
  {
    id: 'system-002',
    type: 'System',
    name: 'Database Server Beta',
    characteristics: { load: 'medium', criticality: 'high' },
  },
  {
    id: 'system-003',
    type: 'System',
    name: 'Load Balancer Gamma',
    characteristics: { load: 'low', criticality: 'medium' },
  },
  {
    id: 'system-004',
    type: 'System',
    name: 'Development Server Delta',
    characteristics: { load: 'low', criticality: 'low' },
  },
  {
    id: 'system-005',
    type: 'System',
    name: 'Analytics Server Epsilon',
    characteristics: { load: 'high', criticality: 'medium' },
  },

  // AI Agents with different specializations
  {
    id: 'ai-agent-001',
    type: 'AI_Agent',
    name: 'Threat Detection AI',
    characteristics: { specialization: 'security', accuracy: 'high' },
  },
  {
    id: 'ai-agent-002',
    type: 'AI_Agent',
    name: 'Network Analysis AI',
    characteristics: { specialization: 'network', accuracy: 'medium' },
  },
  {
    id: 'ai-agent-003',
    type: 'AI_Agent',
    name: 'Performance Monitor AI',
    characteristics: { specialization: 'performance', accuracy: 'low' },
  },
  {
    id: 'ai-agent-004',
    type: 'AI_Agent',
    name: 'Anomaly Detection AI',
    characteristics: { specialization: 'anomaly', accuracy: 'high' },
  },

  // Threats with different severities
  {
    id: 'threat-001',
    type: 'Threat',
    name: 'Suspicious Activity Detected',
    characteristics: { severity: 'medium', persistence: 'high' },
  },
  {
    id: 'threat-002',
    type: 'Threat',
    name: 'DDoS Attack Pattern',
    characteristics: { severity: 'critical', persistence: 'low' },
  },
  {
    id: 'threat-003',
    type: 'Threat',
    name: 'Data Exfiltration Attempt',
    characteristics: { severity: 'high', persistence: 'medium' },
  },
  {
    id: 'threat-004',
    type: 'Threat',
    name: 'Malware Detection',
    characteristics: { severity: 'low', persistence: 'high' },
  },

  // Network nodes with different roles
  {
    id: 'network-node-001',
    type: 'Network_Node',
    name: 'Core Router',
    characteristics: { role: 'core', traffic: 'high' },
  },
  {
    id: 'network-node-002',
    type: 'Network_Node',
    name: 'Edge Switch',
    characteristics: { role: 'edge', traffic: 'medium' },
  },
  {
    id: 'network-node-003',
    type: 'Network_Node',
    name: 'Backup Router',
    characteristics: { role: 'backup', traffic: 'low' },
  },
  {
    id: 'network-node-004',
    type: 'Network_Node',
    name: 'DMZ Gateway',
    characteristics: { role: 'security', traffic: 'high' },
  },

  // Users with different roles
  {
    id: 'user-001',
    type: 'User',
    name: 'Admin User',
    characteristics: { role: 'admin', activity: 'high' },
  },
  {
    id: 'user-002',
    type: 'User',
    name: 'Developer User',
    characteristics: { role: 'developer', activity: 'medium' },
  },
  {
    id: 'user-003',
    type: 'User',
    name: 'Analyst User',
    characteristics: { role: 'analyst', activity: 'low' },
  },
  {
    id: 'user-004',
    type: 'User',
    name: 'Guest User',
    characteristics: { role: 'guest', activity: 'very_low' },
  },
];

// Property configurations with high-frequency changes for realistic cybersecurity monitoring...
