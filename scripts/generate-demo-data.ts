// Demo entity configurations
export type EntityType = 'System' | 'User' | 'Sensor' | 'Threat';

export interface DemoEntityConfig {
  id: string;
  name: string;
  type: EntityType;
  properties: {
    [key: string]: {
      initialValue: string | number;
      changeFrequency: 'low' | 'medium' | 'high';
      valueRange?: [number, number];
      possibleValues?: string[];
    };
  };
}

export const demoEntities: DemoEntityConfig[] = [
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
  {
    id: 'beta-2',
    name: 'beta-2',
    type: 'System',
    properties: {
      hostname: {
        initialValue: 'beta-server',
        changeFrequency: 'low',
        possibleValues: ['beta-server', 'beta-prod', 'beta-staging'],
      },
      cpu: {
        initialValue: 23,
        changeFrequency: 'medium',
        valueRange: [10, 80],
      },
      memory: {
        initialValue: 34,
        changeFrequency: 'medium',
        valueRange: [15, 75],
      },
      location: {
        initialValue: 'us-east-1',
        changeFrequency: 'low',
        possibleValues: ['us-east-1', 'us-west-2'],
      },
    },
  },
  {
    id: 'user-jane',
    name: 'jane.doe',
    type: 'User',
    properties: {
      status: {
        initialValue: 'online',
        changeFrequency: 'medium',
        possibleValues: ['online', 'away', 'offline', 'busy'],
      },
      location: {
        initialValue: 'San Francisco',
        changeFrequency: 'low',
        possibleValues: ['San Francisco', 'New York', 'London', 'Tokyo'],
      },
      lastActivity: {
        initialValue: '2 minutes ago',
        changeFrequency: 'high',
        possibleValues: [
          'just now',
          '1 minute ago',
          '2 minutes ago',
          '5 minutes ago',
        ],
      },
    },
  },
  {
    id: 'sensor-temp-1',
    name: 'temperature-sensor-1',
    type: 'Sensor',
    properties: {
      temperature: {
        initialValue: 22.5,
        changeFrequency: 'high',
        valueRange: [18, 28],
      },
      humidity: {
        initialValue: 45,
        changeFrequency: 'medium',
        valueRange: [30, 70],
      },
      battery: {
        initialValue: 87,
        changeFrequency: 'low',
        valueRange: [0, 100],
      },
    },
  },
  {
    id: 'threat-001',
    name: 'malware-detection-001',
    type: 'Threat',
    properties: {
      threat_score: {
        initialValue: 0.7,
        changeFrequency: 'high',
        valueRange: [0.1, 0.95],
      },
      severity: {
        initialValue: 'high',
        changeFrequency: 'medium',
        possibleValues: ['low', 'medium', 'high', 'critical', 'emergency'],
      },
      detection_count: {
        initialValue: 5,
        changeFrequency: 'high',
        valueRange: [1, 50],
      },
      source_ip: {
        initialValue: '192.168.1.100',
        changeFrequency: 'low',
        possibleValues: [
          '192.168.1.100',
          '10.0.0.50',
          '172.16.0.25',
          '203.0.113.45',
          '198.51.100.123',
        ],
      },
      attack_type: {
        initialValue: 'malware',
        changeFrequency: 'low',
        possibleValues: ['malware', 'ddos', 'phishing', 'sql-injection', 'xss'],
      },
      mitigation_status: {
        initialValue: 'active',
        changeFrequency: 'medium',
        possibleValues: ['active', 'investigating', 'mitigated', 'resolved'],
      },
    },
  },
  {
    id: 'threat-002',
    name: 'network-intrusion-002',
    type: 'Threat',
    properties: {
      threat_score: {
        initialValue: 0.4,
        changeFrequency: 'high',
        valueRange: [0.1, 0.95],
      },
      severity: {
        initialValue: 'medium',
        changeFrequency: 'medium',
        possibleValues: ['low', 'medium', 'high', 'critical', 'emergency'],
      },
      detection_count: {
        initialValue: 3,
        changeFrequency: 'high',
        valueRange: [1, 50],
      },
      source_ip: {
        initialValue: '10.0.0.50',
        changeFrequency: 'low',
        possibleValues: [
          '192.168.1.100',
          '10.0.0.50',
          '172.16.0.25',
          '203.0.113.45',
          '198.51.100.123',
        ],
      },
      attack_type: {
        initialValue: 'ddos',
        changeFrequency: 'low',
        possibleValues: ['malware', 'ddos', 'phishing', 'sql-injection', 'xss'],
      },
      mitigation_status: {
        initialValue: 'investigating',
        changeFrequency: 'medium',
        possibleValues: ['active', 'investigating', 'mitigated', 'resolved'],
      },
    },
  },
  {
    id: 'threat-003',
    name: 'phishing-attempt-003',
    type: 'Threat',
    properties: {
      threat_score: {
        initialValue: 0.2,
        changeFrequency: 'high',
        valueRange: [0.1, 0.95],
      },
      severity: {
        initialValue: 'low',
        changeFrequency: 'medium',
        possibleValues: ['low', 'medium', 'high', 'critical', 'emergency'],
      },
      detection_count: {
        initialValue: 1,
        changeFrequency: 'high',
        valueRange: [1, 50],
      },
      source_ip: {
        initialValue: '172.16.0.25',
        changeFrequency: 'low',
        possibleValues: [
          '192.168.1.100',
          '10.0.0.50',
          '172.16.0.25',
          '203.0.113.45',
          '198.51.100.123',
        ],
      },
      attack_type: {
        initialValue: 'phishing',
        changeFrequency: 'low',
        possibleValues: ['malware', 'ddos', 'phishing', 'sql-injection', 'xss'],
      },
      mitigation_status: {
        initialValue: 'resolved',
        changeFrequency: 'medium',
        possibleValues: ['active', 'investigating', 'mitigated', 'resolved'],
      },
    },
  },
  {
    id: 'threat-004',
    name: 'critical-breach-004',
    type: 'Threat',
    properties: {
      threat_score: {
        initialValue: 0.9,
        changeFrequency: 'high',
        valueRange: [0.1, 0.95],
      },
      severity: {
        initialValue: 'critical',
        changeFrequency: 'medium',
        possibleValues: ['low', 'medium', 'high', 'critical', 'emergency'],
      },
      detection_count: {
        initialValue: 15,
        changeFrequency: 'high',
        valueRange: [1, 50],
      },
      source_ip: {
        initialValue: '203.0.113.45',
        changeFrequency: 'low',
        possibleValues: [
          '192.168.1.100',
          '10.0.0.50',
          '172.16.0.25',
          '203.0.113.45',
          '198.51.100.123',
        ],
      },
      attack_type: {
        initialValue: 'sql-injection',
        changeFrequency: 'low',
        possibleValues: ['malware', 'ddos', 'phishing', 'sql-injection', 'xss'],
      },
      mitigation_status: {
        initialValue: 'active',
        changeFrequency: 'medium',
        possibleValues: ['active', 'investigating', 'mitigated', 'resolved'],
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
