import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { subDays, addMinutes, format } from 'date-fns';
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
}

interface EnumConfig {
  values: string[];
  changeRate: number;
}

type PropertyConfig = NumericConfig | EnumConfig;

// Entity configurations...

const entities = [
  { id: 'system-001', type: 'System', name: 'Production Server Alpha' },
  { id: 'system-002', type: 'System', name: 'Database Server Beta' },
  { id: 'system-003', type: 'System', name: 'Load Balancer Gamma' },
  { id: 'ai-agent-001', type: 'AI_Agent', name: 'Threat Detection AI' },
  { id: 'ai-agent-002', type: 'AI_Agent', name: 'Network Analysis AI' },
  { id: 'threat-001', type: 'Threat', name: 'Suspicious Activity Detected' },
  { id: 'threat-002', type: 'Threat', name: 'DDoS Attack Pattern' },
  { id: 'network-node-001', type: 'Network_Node', name: 'Core Router' },
  { id: 'network-node-002', type: 'Network_Node', name: 'Edge Switch' },
  { id: 'user-001', type: 'User', name: 'Admin User' },
];

// Property configurations with realistic change patterns...

const propertyConfigs: Record<string, Record<string, PropertyConfig>> = {
  System: {
    cpu_usage: { min: 20, max: 95, changeRate: 0.3 },
    memory_usage: { min: 30, max: 90, changeRate: 0.25 },
    network_connections: { min: 50, max: 500, changeRate: 0.4 },
    status: { values: ['online', 'offline', 'maintenance'], changeRate: 0.05 },
  },
  AI_Agent: {
    confidence_score: { min: 0.6, max: 0.99, changeRate: 0.2 },
    response_time: { min: 50, max: 300, changeRate: 0.35 },
    active_requests: { min: 10, max: 200, changeRate: 0.4 },
    model_version: { values: ['v1.2.3', 'v1.2.4', 'v1.3.0'], changeRate: 0.02 },
  },
  Threat: {
    threat_score: { min: 0.3, max: 0.95, changeRate: 0.25 },
    severity: {
      values: ['low', 'medium', 'high', 'critical'],
      changeRate: 0.15,
    },
    detection_count: { min: 1, max: 50, changeRate: 0.3 },
  },
  Network_Node: {
    bandwidth_usage: { min: 100, max: 1000, changeRate: 0.4 },
    connection_count: { min: 20, max: 300, changeRate: 0.35 },
    latency: { min: 5, max: 150, changeRate: 0.3 },
    packet_loss: { min: 0, max: 5, changeRate: 0.2 },
  },
  User: {
    login_count: { min: 0, max: 20, changeRate: 0.1 },
    last_activity: { values: ['active', 'idle', 'away'], changeRate: 0.2 },
  },
};

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
    // For numeric properties - truly random within range...

    const shouldChange = Math.random() < config.changeRate;
    if (!shouldChange && previousValue !== undefined) {
      return previousValue;
    }

    // Generate random value within range...

    const value = Math.random() * (config.max - config.min) + config.min;
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
    const config = propertyConfigs[entity.type];
    if (!config) continue;

    const properties = Object.keys(config);
    const currentValues: Record<string, string | number> = {};

    // Initialize current values with random starting points...

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

    // Generate changes over time with more realistic patterns...

    let currentTime = startDate;
    while (currentTime <= endDate) {
      for (const prop of properties) {
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

      // Move to next time interval (every 15 minutes)...

      currentTime = addMinutes(currentTime, 15);
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
