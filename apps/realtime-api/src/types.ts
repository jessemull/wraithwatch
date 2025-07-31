export type EntityType =
  | 'System'
  | 'User'
  | 'Sensor'
  | 'AI_Agent'
  | 'Threat'
  | 'Network_Node'
  | 'Server'
  | 'Workstation';

export type ThreatSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ProtocolType =
  | 'HTTPS'
  | 'HTTP'
  | 'SSH'
  | 'SMB'
  | 'FTP'
  | 'DNS'
  | 'SMTP';

export type AgentAction =
  | 'monitoring'
  | 'investigating'
  | 'blocking'
  | 'isolating'
  | 'quarantining';

export interface PropertyConfig {
  name: string;
  type: 'string' | 'number';
  possibleValues?: string[];
  minValue?: number;
  maxValue?: number;
  changeFrequency: number;
}

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  properties: Record<string, EntityProperty>;
  lastSeen: string;
  changesToday: number;

  // Cybersecurity fields...

  threatScore?: number; // 0-1 scale
  ipAddress?: string;
  location?: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
  agentId?: string; // For AI agent tracking
  confidence?: number; // 0-1 scale for AI decisions
}

export interface EntityProperty {
  name: string;
  currentValue: string | number;
  lastChanged: string;
  history: PropertyChange[];
}

export interface PropertyChange {
  timestamp: string;
  oldValue: string | number;
  newValue: string | number;
  changeType?: 'increment' | 'decrement' | 'replacement';
}

// WebSocket message types...

export interface WebSocketMessage {
  type:
    | 'entity_update'
    | 'entity_list'
    | 'property_change'
    | 'connection_status'
    | 'network_activity'
    | 'agent_action'
    | 'threat_detected'
    | 'geo_event';
  payload: unknown;
}

export interface EntityUpdateMessage {
  type: 'entity_update';
  payload: {
    entityId: string;
    property: string;
    timestamp: string;
    oldValue: string | number;
    newValue: string | number;
  };
}

export interface EntityListMessage {
  type: 'entity_list';
  payload: {
    entities: Entity[];
  };
}

export interface PropertyChangeMessage {
  type: 'property_change';
  payload: {
    entityId: string;
    propertyName: string;
    change: PropertyChange;
  };
}

// Cybersecurity event messages...

export interface NetworkActivityMessage {
  type: 'network_activity';
  payload: {
    sourceIp: string;
    destIp: string;
    protocol: ProtocolType;
    bytesSent: number;
    bytesReceived: number;
    threatScore: number;
    timestamp: string;
  };
}

export interface AgentActionMessage {
  type: 'agent_action';
  payload: {
    agentId: string;
    observation: string;
    action: AgentAction;
    confidence: number;
    target: string;
    threatScore: number;
    timestamp: string;
  };
}

export interface ThreatDetectedMessage {
  type: 'threat_detected';
  payload: {
    threatType: string;
    sourceIp: string;
    targetSystem: string;
    severity: ThreatSeverity;
    confidence: number;
    threatScore: number;
    timestamp: string;
  };
}

export interface GeoEventMessage {
  type: 'geo_event';
  payload: {
    ip: string;
    latitude: number;
    longitude: number;
    activity: string;
    threatScore: number;
    timestamp: string;
  };
}

// Demo data types...

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
