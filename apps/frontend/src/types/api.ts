export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  count: number;
  error?: string;
}

export interface HistoryQuery {
  propertyName?: string;
  startTime?: string;
  endTime?: string;
  limit?: number;
}

export interface RecentChangesQuery {
  entityType?: string;
  limit?: number;
  hours?: number;
}

export interface EntityChange {
  entity_id: string;
  entity_type: string;
  property_name: string;
  value: string | number;
  timestamp: string;
}

export interface AggregatedMetrics {
  activeThreats: number;
  threatScore: string;
  aiConfidence: number;
  totalConnections: number;
  threatSeverityDistribution: Record<string, number>;
  aiAgentActivity: Record<string, number>;
  protocolUsage: Record<string, number>;
  entityChangesByDay: Record<string, number>;
}

export interface EntityState {
  entity_type: string;
  [key: string]: string | number;
}
