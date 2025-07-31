import { DemoEntityConfig, Entity, EntityProperty } from './types';

// Demo entity configurations...

export const demoEntities: DemoEntityConfig[] = [
  // AI Agents...

  {
    id: 'sentinel-42',
    name: 'Sentinel-42',
    type: 'AI_Agent',
    properties: {
      status: {
        initialValue: 'monitoring',
        changeFrequency: 'medium',
        possibleValues: [
          'monitoring',
          'investigating',
          'blocking',
          'isolating',
        ],
      },
      confidence: {
        initialValue: 0.92,
        changeFrequency: 'high',
        valueRange: [0.7, 0.99],
      },
      threatsDetected: {
        initialValue: 3,
        changeFrequency: 'high',
        valueRange: [0, 10],
      },
      responseTime: {
        initialValue: 0.15,
        changeFrequency: 'medium',
        valueRange: [0.05, 0.5],
      },
    },
  },
  {
    id: 'guardian-7',
    name: 'Guardian-7',
    type: 'AI_Agent',
    properties: {
      status: {
        initialValue: 'monitoring',
        changeFrequency: 'medium',
        possibleValues: [
          'monitoring',
          'investigating',
          'blocking',
          'isolating',
        ],
      },
      confidence: {
        initialValue: 0.88,
        changeFrequency: 'high',
        valueRange: [0.75, 0.95],
      },
      threatsDetected: {
        initialValue: 1,
        changeFrequency: 'high',
        valueRange: [0, 8],
      },
      responseTime: {
        initialValue: 0.22,
        changeFrequency: 'medium',
        valueRange: [0.08, 0.4],
      },
    },
  },

  // Network Nodes...

  {
    id: 'web-server-12',
    name: 'web-server-12',
    type: 'Network_Node',
    properties: {
      ipAddress: {
        initialValue: '192.168.1.25',
        changeFrequency: 'low',
        possibleValues: ['192.168.1.25', '192.168.1.26'],
      },
      connections: {
        initialValue: 45,
        changeFrequency: 'high',
        valueRange: [20, 100],
      },
      threatScore: {
        initialValue: 0.15,
        changeFrequency: 'high',
        valueRange: [0, 0.9],
      },
      protocol: {
        initialValue: 'HTTPS',
        changeFrequency: 'medium',
        possibleValues: ['HTTPS', 'HTTP', 'SSH'],
      },
    },
  },
  {
    id: 'db-server-3',
    name: 'db-server-3',
    type: 'Network_Node',
    properties: {
      ipAddress: {
        initialValue: '10.0.0.5',
        changeFrequency: 'low',
        possibleValues: ['10.0.0.5', '10.0.0.6'],
      },
      connections: {
        initialValue: 12,
        changeFrequency: 'high',
        valueRange: [5, 30],
      },
      threatScore: {
        initialValue: 0.08,
        changeFrequency: 'high',
        valueRange: [0, 0.7],
      },
      protocol: {
        initialValue: 'SSH',
        changeFrequency: 'medium',
        possibleValues: ['SSH', 'SMB', 'HTTPS'],
      },
    },
  },

  // Threats...

  {
    id: 'threat-port-scan',
    name: 'Port Scan Detected',
    type: 'Threat',
    properties: {
      severity: {
        initialValue: 'high',
        changeFrequency: 'low',
        possibleValues: ['low', 'medium', 'high', 'critical'],
      },
      sourceIp: {
        initialValue: '198.51.100.12',
        changeFrequency: 'low',
        possibleValues: ['198.51.100.12', '203.0.113.45', '192.0.2.78'],
      },
      targetSystem: {
        initialValue: 'internal-db-3',
        changeFrequency: 'low',
        possibleValues: ['internal-db-3', 'web-server-12', 'api-gateway'],
      },
      confidence: {
        initialValue: 0.88,
        changeFrequency: 'medium',
        valueRange: [0.7, 0.95],
      },
    },
  },

  // Original entities for compatibility...

  {
    id: 'alpha-1',
    name: 'alpha-1',
    type: 'System',
    properties: {
      hostname: {
        initialValue: 'host-123',
        changeFrequency: 'low',
        possibleValues: ['host-123', 'host-456', 'host-789'],
      },
      cpu: {
        initialValue: 45,
        changeFrequency: 'high',
        valueRange: [5, 95],
      },
      memory: {
        initialValue: 67,
        changeFrequency: 'medium',
        valueRange: [20, 90],
      },
      location: {
        initialValue: 'us-west-2',
        changeFrequency: 'low',
        possibleValues: ['us-west-2', 'us-east-1', 'eu-west-1'],
      },
      networkConnections: {
        initialValue: 12,
        changeFrequency: 'high',
        valueRange: [0, 50],
      },
    },
  },
];

export const generateRandomValue = (
  config: DemoEntityConfig['properties'][string]
): string | number => {
  if (config.valueRange) {
    const [min, max] = config.valueRange;
    return Math.round((Math.random() * (max - min) + min) * 10) / 10;
  }

  if (config.possibleValues) {
    return config.possibleValues[
      Math.floor(Math.random() * config.possibleValues.length)
    ];
  }

  return config.initialValue;
};

export const shouldChangeProperty = (
  frequency: 'low' | 'medium' | 'high'
): boolean => {
  const probabilities = {
    low: 0.1,
    medium: 0.3,
    high: 0.6,
  };

  return Math.random() < probabilities[frequency];
};

// Initialize entities from demo config...

export const initializeEntities = (): Entity[] => {
  return demoEntities.map(config => {
    const properties: Record<string, EntityProperty> = {};

    Object.entries(config.properties).forEach(([key, propConfig]) => {
      properties[key] = {
        name: key,
        currentValue: propConfig.initialValue,
        lastChanged: new Date().toISOString(),
        history: [],
      };
    });

    // Add cybersecurity fields based on entity type...

    const entity: Entity = {
      id: config.id,
      name: config.name,
      type: config.type,
      properties,
      lastSeen: new Date().toISOString(),
      changesToday: 0,
    };

    // Add type-specific cybersecurity fields...

    if (config.type === 'AI_Agent') {
      entity.agentId = config.id;
      entity.confidence =
        (properties.confidence?.currentValue as number) || 0.9;
      entity.threatScore = 0.1; // Agents have low threat scores
    } else if (config.type === 'Network_Node') {
      entity.ipAddress =
        (properties.ipAddress?.currentValue as string) || '192.168.1.1';
      entity.threatScore =
        (properties.threatScore?.currentValue as number) || 0.1;
      entity.location = {
        latitude: 37.7749,
        longitude: -122.4194,
        city: 'San Francisco',
        country: 'US',
      };
    } else if (config.type === 'Threat') {
      entity.threatScore = 0.8; // High threat score for threats
      entity.ipAddress =
        (properties.sourceIp?.currentValue as string) || '198.51.100.12';
      entity.location = {
        latitude: 40.7128,
        longitude: -74.006,
        city: 'New York',
        country: 'US',
      };
    }

    return entity;
  });
};
