// Property change frequency configuration

export const PROPERTY_CHANGE_FREQUENCIES: Record<string, number> = {
  // System properties

  cpu_usage: 0.8,
  memory_usage: 0.6,
  network_connections: 0.9,
  disk_usage: 0.3,
  response_time: 0.7,

  // AI Agent properties

  confidence_score: 0.5,
  active_requests: 0.8,
  model_version: 0.01,
  accuracy: 0.4,
  training_status: 0.05,
  status: 0.03,

  // Threat properties
  threat_score: 0.3,
  severity: 0.1,
  detection_count: 0.4,
  source_ip: 0.05,
  attack_type: 0.02,
  mitigation_status: 0.08,

  // Network Node properties

  bandwidth_usage: 0.7,
  connection_count: 0.8,
  latency: 0.6,
  packet_loss: 0.4,
  error_rate: 0.3,
  routing_status: 0.03,

  // User properties

  login_count: 0.2,
  last_activity: 0.3,
  session_duration: 0.4,
  permission_level: 0.01,
  failed_login_attempts: 0.1,

  // Sensor properties

  temperature: 0.6,
  humidity: 0.4,
  battery: 0.1,
};

// Entity type property mappings

export const ENTITY_TYPE_PROPERTIES: Record<string, string[]> = {
  System: [
    'cpu_usage',
    'memory_usage',
    'network_connections',
    'disk_usage',
    'response_time',
    'status',
  ],
  AI_Agent: [
    'confidence_score',
    'response_time',
    'active_requests',
    'model_version',
    'accuracy',
    'training_status',
    'status',
  ],
  Threat: [
    'threat_score',
    'severity',
    'detection_count',
    'source_ip',
    'attack_type',
    'mitigation_status',
  ],
  Network_Node: [
    'bandwidth_usage',
    'connection_count',
    'latency',
    'packet_loss',
    'error_rate',
    'routing_status',
  ],
  User: [
    'login_count',
    'last_activity',
    'session_duration',
    'permission_level',
    'failed_login_attempts',
  ],
  Server: [
    'cpu_usage',
    'memory_usage',
    'network_connections',
    'disk_usage',
    'response_time',
    'status',
  ],
  Workstation: [
    'cpu_usage',
    'memory_usage',
    'network_connections',
    'disk_usage',
    'response_time',
    'status',
  ],
  Sensor: ['temperature', 'humidity', 'battery', 'status'],
};

// Value generator configurations

export const STATUS_VALUES = {
  AI_AGENT: ['online', 'away', 'offline', 'busy'],
  DEFAULT: [
    'online',
    'offline',
    'maintenance',
    'degraded',
    'overloaded',
    'recovering',
  ],
  TRAINING: ['idle', 'training', 'evaluating', 'deploying', 'failed'],
  SEVERITY: ['low', 'medium', 'high', 'critical', 'emergency'],
  MITIGATION: [
    'detected',
    'investigating',
    'mitigating',
    'resolved',
    'false_positive',
  ],
  ROUTING: ['optimal', 'congested', 'rerouting', 'failed', 'maintenance'],
  ACTIVITY: ['active', 'idle', 'away', 'offline', 'suspended', 'locked'],
  PERMISSION: ['guest', 'user', 'admin', 'super_admin', 'read_only'],
  ATTACK_TYPES: [
    'ddos',
    'malware',
    'phishing',
    'sql_injection',
    'xss',
    'brute_force',
  ],
  MODEL_VERSIONS: ['v1.2.3', 'v1.2.4', 'v1.3.0', 'v1.3.1', 'v1.4.0'],
  SOURCE_IPS: [
    '192.168.1.100',
    '10.0.0.50',
    '172.16.0.25',
    '203.0.113.45',
    '198.51.100.123',
  ],
} as const;

// Value ranges for numeric properties

export const VALUE_RANGES = {
  CPU_USAGE: { min: 10, max: 95 },
  MEMORY_USAGE: { min: 20, max: 90 },
  NETWORK_CONNECTIONS: { min: 50, max: 2000 },
  DISK_USAGE: { min: 30, max: 85 },
  RESPONSE_TIME: { min: 10, max: 500 },
  CONFIDENCE_SCORE: { min: 0.5, max: 0.99 },
  ACTIVE_REQUESTS: { min: 5, max: 500 },
  ACCURACY: { min: 0.7, max: 0.98 },
  THREAT_SCORE: { min: 0.1, max: 0.95 },
  DETECTION_COUNT: { min: 1, max: 100 },
  BANDWIDTH_USAGE: { min: 100, max: 2000 },
  CONNECTION_COUNT: { min: 10, max: 500 },
  LATENCY: { min: 1, max: 200 },
  PACKET_LOSS: { min: 0, max: 10 },
  ERROR_RATE: { min: 0, max: 5 },
  LOGIN_COUNT: { min: 0, max: 50 },
  SESSION_DURATION: { min: 0, max: 480 },
  FAILED_LOGIN_ATTEMPTS: { min: 0, max: 10 },
  TEMPERATURE: { min: 20, max: 50 },
  HUMIDITY: { min: 40, max: 100 },
  BATTERY: { min: 0, max: 100 },
} as const;
