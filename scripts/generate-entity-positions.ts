import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { createHash } from 'crypto';
import { EntityPosition as FrontendEntityPosition } from '../apps/frontend/src/types/entity';

// Types for entity positions...

interface EntityPosition extends FrontendEntityPosition {
  PK: string;
  SK: string;
  TTL: number;
}

interface EntityCharacteristics {
  load?: 'high' | 'medium' | 'low';
  criticality?: 'critical' | 'high' | 'medium' | 'low';
  specialization?: string;
  accuracy?: 'high' | 'medium' | 'low';
  severity?: 'critical' | 'high' | 'medium' | 'low';
  persistence?: 'high' | 'medium' | 'low';
  role?: string;
  traffic?: 'high' | 'medium' | 'low';
  activity?: 'high' | 'medium' | 'low' | 'very_low';
}

interface EntityConfig {
  id: string;
  type: string;
  name: string;
  characteristics: EntityCharacteristics;
}

const ENTITY_CONFIGURATIONS: EntityConfig[] = [
  // Systems...

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

  // AI Agents...

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

  // Threats...

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

  // Network Nodes...

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

  // Users...

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

// Utility functions for deterministic positioning...

function generateEntityHash(entityId: string): string {
  return createHash('md5').update(entityId).digest('hex').substring(0, 8);
}

function generateDeterministicSeed(entityId: string): number {
  const hash = generateEntityHash(entityId);
  return parseInt(hash, 16);
}

function deterministicRandom(seed: number, index: number = 0): number {
  // Simple deterministic random number generator...

  const x = Math.sin(seed + index) * 10000;
  return x - Math.floor(x);
}

function generateTimelinePosition(
  entity: EntityConfig,
  index: number
): [number, number, number] {
  const seed = generateDeterministicSeed(entity.id);

  // Spread entities across the timeline height...

  const entityY = (index / (ENTITY_CONFIGURATIONS.length - 1) - 0.5) * 16;

  // Generate deterministic random positions around the timeline...

  const angle = deterministicRandom(seed) * Math.PI * 2;
  const radius = 2 + deterministicRandom(seed, 1) * 4; // 2-6 units from timeline

  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  return [x, entityY, z];
}

function generateNetworkPosition(
  entity: EntityConfig,
  index: number
): [number, number, number] {
  const seed = generateDeterministicSeed(entity.id);

  // Create a more spherical network layout with entities positioned in 3D space...

  const angle = (index / ENTITY_CONFIGURATIONS.length) * Math.PI * 2;
  const elevation = (deterministicRandom(seed) - 0.5) * Math.PI; // Full sphere elevation
  const radius = 6 + deterministicRandom(seed, 1) * 4; // 6-10 units from center

  const x = radius * Math.cos(elevation) * Math.cos(angle);
  const y = radius * Math.sin(elevation);
  const z = radius * Math.cos(elevation) * Math.sin(angle);

  return [x, y, z];
}

function generateMatrixPosition(
  entity: EntityConfig,
  index: number
): [number, number, number] {
  const seed = generateDeterministicSeed(entity.id);

  if (entity.type !== 'Threat') {
    const gridSize = Math.ceil(Math.cbrt(ENTITY_CONFIGURATIONS.length));
    const layer = Math.floor(index / (gridSize * gridSize));
    const row = Math.floor((index % (gridSize * gridSize)) / gridSize);
    const col = index % gridSize;
    return [
      (col - gridSize / 2 + 0.5) * 2,
      (row - gridSize / 2 + 0.5) * 2 + 2, // Add 2 to move up
      (layer - gridSize / 2 + 0.5) * 2,
    ];
  }

  // For threats, position based on severity and detection count...

  const severity = entity.characteristics.severity || 'low';
  const detectionCount = deterministicRandom(seed) * 100; // 0-100 range
  const threatScore = deterministicRandom(seed, 1); // 0-1 range

  // Y-axis: Severity (bottom to top) - moved up by 2 units...

  let y = 0;
  switch (severity) {
    case 'critical':
      y = 6;
      break;
    case 'high':
      y = 4;
      break;
    case 'medium':
      y = 2;
      break;
    case 'low':
      y = 0;
      break;
    default:
      y = 2;
  }

  // X-axis: Detection Count (left to right) - 0-100 range...

  const x = Math.max(-4, Math.min(4, (detectionCount / 100) * 8 - 4));

  // Z-axis: Threat Score (back to front) - convert 0-1 to 0-100 scale...

  const threatScorePercent = threatScore * 100;
  const z = (threatScorePercent / 100) * 6 - 3;

  return [x, y, z];
}

function generateChangeParticles(
  entity: EntityConfig
): Array<{ x: number; y: number; z: number }> {
  const seed = generateDeterministicSeed(entity.id);
  const particleCount = 100 + Math.floor(deterministicRandom(seed) * 101); // 100-200 particles
  const particles: Array<{ x: number; y: number; z: number }> = [];

  // Get the entity's timeline position as the center...

  const entityIndex = ENTITY_CONFIGURATIONS.findIndex(e => e.id === entity.id);
  const [centerX, centerY, centerZ] = generateTimelinePosition(
    entity,
    entityIndex
  );

  for (let i = 0; i < particleCount; i++) {
    const particleSeed = seed + i;

    // Generate deterministic positions around the entity...

    const angle = deterministicRandom(particleSeed) * Math.PI * 2;
    const radius = 1 + deterministicRandom(particleSeed, 1) * 3; // 1-4 units from entity
    const verticalOffset = (deterministicRandom(particleSeed, 2) - 0.5) * 12; // ±6 units vertical

    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + verticalOffset;
    const z = centerZ + Math.sin(angle) * radius;

    particles.push({ x, y, z });
  }

  return particles;
}

function createEntityPosition(
  entity: EntityConfig,
  index: number
): EntityPosition {
  const timelinePos = generateTimelinePosition(entity, index);
  const networkPos = generateNetworkPosition(entity, index);
  const matrixPos = generateMatrixPosition(entity, index);
  const changeParticles = generateChangeParticles(entity);

  const ttl = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days

  return {
    PK: `ENTITY_POSITION#${entity.id}`,
    SK: 'VISUALIZATION',
    entity_id: entity.id,
    entity_type: entity.type,
    name: entity.name,
    timeline_position: {
      x: timelinePos[0],
      y: timelinePos[1],
      z: timelinePos[2],
    },
    network_position: {
      x: networkPos[0],
      y: networkPos[1],
      z: networkPos[2],
    },
    matrix_position: {
      x: matrixPos[0],
      y: matrixPos[1],
      z: matrixPos[2],
    },
    change_particles: changeParticles,
    TTL: ttl,
  };
}

// Database operations...

class DynamoDBService {
  private docClient: DynamoDBDocumentClient;
  private readonly tableName = 'wraithwatch-entity-changes';
  private readonly batchSize = 25;

  constructor() {
    const client = new DynamoDBClient({ region: 'us-east-1' });
    this.docClient = DynamoDBDocumentClient.from(client);
  }

  async loadPositions(positions: EntityPosition[]): Promise<void> {
    const totalBatches = Math.ceil(positions.length / this.batchSize);

    for (let i = 0; i < positions.length; i += this.batchSize) {
      const batch = positions.slice(i, i + this.batchSize);
      const batchNumber = Math.floor(i / this.batchSize) + 1;

      try {
        await this.writeBatch(batch);
        console.log(`Loaded position batch ${batchNumber}/${totalBatches}`);
      } catch (error) {
        console.error(`Error loading position batch ${batchNumber}:`, error);
      }
    }
  }

  private async writeBatch(positions: EntityPosition[]): Promise<void> {
    const writeRequests = positions.map(position => ({
      PutRequest: {
        Item: position,
      },
    }));

    await this.docClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [this.tableName]: writeRequests,
        },
      })
    );
  }
}

// Main execution...

async function main(): Promise<void> {
  console.log('Generating entity positions...');

  const positions: EntityPosition[] = [];

  for (let i = 0; i < ENTITY_CONFIGURATIONS.length; i++) {
    const entity = ENTITY_CONFIGURATIONS[i];
    const position = createEntityPosition(entity, i);
    positions.push(position);
  }

  console.log(`Generated ${positions.length} entity positions`);

  console.log('Loading positions to DynamoDB...');

  const dbService = new DynamoDBService();
  await dbService.loadPositions(positions);

  console.log('Position data loading complete!');
}

main().catch(console.error);
