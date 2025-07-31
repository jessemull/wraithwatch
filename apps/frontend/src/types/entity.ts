export type EntityType =
  | 'System'
  | 'User'
  | 'Sensor'
  | 'AI_Agent'
  | 'Threat'
  | 'Network_Node';

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

export interface Entity {
  changesToday: number;
  id: string;
  lastSeen: string;
  name: string;
  properties: Record<string, EntityProperty>;
  type: EntityType;

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
  currentValue: string | number;
  history: PropertyChange[];
  lastChanged: string;
  name: string;
}

export interface PropertyChange {
  changeType?: 'decrement' | 'increment' | 'replacement';
  newValue: string | number;
  oldValue: string | number;
  timestamp: string;
}
