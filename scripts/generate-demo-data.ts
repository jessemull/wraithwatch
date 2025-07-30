import { DemoEntityConfig } from '../shared/types';

// Demo entity configurations
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
