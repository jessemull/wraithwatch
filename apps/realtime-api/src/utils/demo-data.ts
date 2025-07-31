import { Entity, PropertyConfig, EntityType } from '../types/entity';

// Demo entity configurations...

export const demoEntities: Array<{
  id: string;
  name: string;
  type: string;
  properties: Record<string, PropertyConfig>;
}> = [
  {
    id: 'sentinel-42',
    name: 'Sentinel-42',
    type: 'AI_Agent',
    properties: {
      status: {
        name: 'status',
        type: 'string',
        possibleValues: ['monitoring', 'investigating', 'blocking', 'isolating'],
        changeFrequency: 0.3,
      },
      confidence: {
        name: 'confidence',
        type: 'number',
        minValue: 0,
        maxValue: 1,
        changeFrequency: 0.4,
      },
      threatsDetected: {
        name: 'threatsDetected',
        type: 'number',
        minValue: 0,
        maxValue: 10,
        changeFrequency: 0.5,
      },
      responseTime: {
        name: 'responseTime',
        type: 'number',
        minValue: 0.1,
        maxValue: 0.5,
        changeFrequency: 0.3,
      },
    },
  },
  {
    id: 'guardian-7',
    name: 'Guardian-7',
    type: 'AI_Agent',
    properties: {
      status: {
        name: 'status',
        type: 'string',
        possibleValues: ['monitoring', 'investigating', 'blocking', 'isolating'],
        changeFrequency: 0.2,
      },
      confidence: {
        name: 'confidence',
        type: 'number',
        minValue: 0,
        maxValue: 1,
        changeFrequency: 0.4,
      },
      threatsDetected: {
        name: 'threatsDetected',
        type: 'number',
        minValue: 0,
        maxValue: 8,
        changeFrequency: 0.6,
      },
      responseTime: {
        name: 'responseTime',
        type: 'number',
        minValue: 0.1,
        maxValue: 0.4,
        changeFrequency: 0.3,
      },
    },
  },
  {
    id: 'web-server-12',
    name: 'web-server-12',
    type: 'Server',
    properties: {
      connections: {
        name: 'connections',
        type: 'number',
        minValue: 10,
        maxValue: 100,
        changeFrequency: 0.7,
      },
      threatScore: {
        name: 'threatScore',
        type: 'number',
        minValue: 0,
        maxValue: 1,
        changeFrequency: 0.4,
      },
      protocol: {
        name: 'protocol',
        type: 'string',
        possibleValues: ['HTTP', 'HTTPS', 'SSH'],
        changeFrequency: 0.3,
      },
      ipAddress: {
        name: 'ipAddress',
        type: 'string',
        possibleValues: ['192.168.1.25', '192.168.1.26'],
        changeFrequency: 0.2,
      },
    },
  },
  {
    id: 'db-server-3',
    name: 'db-server-3',
    type: 'Server',
    properties: {
      connections: {
        name: 'connections',
        type: 'number',
        minValue: 5,
        maxValue: 30,
        changeFrequency: 0.6,
      },
      threatScore: {
        name: 'threatScore',
        type: 'number',
        minValue: 0,
        maxValue: 1,
        changeFrequency: 0.4,
      },
      protocol: {
        name: 'protocol',
        type: 'string',
        possibleValues: ['SSH', 'SMB', 'HTTPS'],
        changeFrequency: 0.3,
      },
      ipAddress: {
        name: 'ipAddress',
        type: 'string',
        possibleValues: ['10.0.0.5', '10.0.0.6'],
        changeFrequency: 0.1,
      },
    },
  },
  {
    id: 'alpha-1',
    name: 'alpha-1',
    type: 'Workstation',
    properties: {
      cpu: {
        name: 'cpu',
        type: 'number',
        minValue: 0,
        maxValue: 100,
        changeFrequency: 0.8,
      },
      memory: {
        name: 'memory',
        type: 'number',
        minValue: 20,
        maxValue: 90,
        changeFrequency: 0.6,
      },
      networkConnections: {
        name: 'networkConnections',
        type: 'number',
        minValue: 0,
        maxValue: 50,
        changeFrequency: 0.7,
      },
      hostname: {
        name: 'hostname',
        type: 'string',
        possibleValues: ['host-123', 'host-456', 'host-789'],
        changeFrequency: 0.2,
      },
      location: {
        name: 'location',
        type: 'string',
        possibleValues: ['us-west-2', 'us-east-1', 'eu-west-1'],
        changeFrequency: 0.1,
      },
    },
  },
  {
    id: 'port-scan-detected',
    name: 'Port Scan Detected',
    type: 'Threat',
    properties: {
      targetSystem: {
        name: 'targetSystem',
        type: 'string',
        possibleValues: ['web-server-12', 'db-server-3', 'internal-db-3', 'api-gateway'],
        changeFrequency: 0.4,
      },
      confidence: {
        name: 'confidence',
        type: 'number',
        minValue: 0.7,
        maxValue: 1,
        changeFrequency: 0.3,
      },
      severity: {
        name: 'severity',
        type: 'string',
        possibleValues: ['low', 'medium', 'high'],
        changeFrequency: 0.2,
      },
      sourceIp: {
        name: 'sourceIp',
        type: 'string',
        possibleValues: ['198.51.100.12', '192.0.2.78', '203.0.113.45'],
        changeFrequency: 0.3,
      },
    },
  },
];

// Initialize entities with demo data...

export const initializeEntities = (): Entity[] => {
  return demoEntities.map(demoEntity => {
    const entity: Entity = {
      id: demoEntity.id,
      name: demoEntity.name,
      type: demoEntity.type as EntityType,
      lastSeen: new Date().toISOString(),
      changesToday: 0,
      properties: {},
    };

    // Initialize properties with current values...

    Object.entries(demoEntity.properties).forEach(([propertyName, config]) => {
      entity.properties[propertyName] = {
        name: config.name,
        currentValue: generateRandomValue(config),
        lastChanged: new Date().toISOString(),
        history: [],
      };
    });

    return entity;
  });
};

// Generate random value based on property configuration...

export const generateRandomValue = (config: PropertyConfig): string | number => {
  if (config.type === 'string' && config.possibleValues) {
    const randomIndex = Math.floor(Math.random() * config.possibleValues.length);
    return config.possibleValues[randomIndex];
  } else if (config.type === 'number') {
    const min = config.minValue || 0;
    const max = config.maxValue || 100;
    return Math.round((Math.random() * (max - min) + min) * 10) / 10;
  }
  return 'unknown';
};

// Check if property should change based on frequency...

export const shouldChangeProperty = (frequency: number): boolean => {
  return Math.random() < frequency;
}; 