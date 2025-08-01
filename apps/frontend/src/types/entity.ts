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

export interface PropertyChange {
  timestamp: string;
  oldValue: string | number;
  newValue: string | number;
  changeType?: 'increment' | 'decrement' | 'replacement';
}

export interface EntityProperty {
  name: string;
  currentValue: string | number;
  lastChanged: string;
  history: PropertyChange[];
}

export interface Entity {
  id: string;
  name: string;
  type: string;
  changesToday: number;
  lastSeen: string;
  properties?: Record<string, EntityProperty>;
}

export interface AggregatedEntityGroup {
  type: string;
  entities: Entity[];
  totalChanges: number;
  lastSeen: string;
}

export interface EntityGroupHeaderProps {
  type: string;
  entities: Entity[];
  totalChanges: number;
  lastSeen: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export interface EntityItemProps {
  entity: Entity;
}
