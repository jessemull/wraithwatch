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
  | 'HTTP'
  | 'HTTPS'
  | 'SSH'
  | 'FTP'
  | 'SMTP'
  | 'DNS'
  | 'SMB'
  | 'RDP'
  | 'LDAP'
  | 'NTP';

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

export interface PropertyChangeMessage extends WebSocketMessage {
  type: 'property_change';
  data: PropertyChange;
}

export interface NetworkActivityMessage extends WebSocketMessage {
  type: 'network_activity';
  data: {
    sourceId: string;
    targetId: string;
    protocol: ProtocolType;
    timestamp: string;
    bytesTransferred: number;
    connectionStatus: 'established' | 'terminated' | 'failed';
  };
}

export interface AgentActionMessage extends WebSocketMessage {
  type: 'agent_action';
  data: {
    agentId: string;
    action: AgentAction;
    targetId?: string;
    timestamp: string;
    confidence: number;
    description: string;
  };
}

export interface ThreatDetectedMessage extends WebSocketMessage {
  type: 'threat_detected';
  data: {
    threatId: string;
    threatType: string;
    severity: ThreatSeverity;
    sourceId: string;
    targetId?: string;
    timestamp: string;
    description: string;
    confidence: number;
    indicators: string[];
  };
}

export interface GeoEventMessage extends WebSocketMessage {
  type: 'geo_event';
  data: {
    eventId: string;
    eventType: 'login' | 'logout' | 'access' | 'denied';
    userId: string;
    location: string;
    ipAddress: string;
    timestamp: string;
    userAgent?: string;
    success: boolean;
  };
}

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