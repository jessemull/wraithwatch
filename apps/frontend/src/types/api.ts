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
  PK: string;
  SK: string;
  entity_id: string;
  entity_type: string;
  property_name: string;
  value: string | number;
  previous_value?: string | number;
  change_type: 'increase' | 'decrease' | 'change';
  timestamp: string;
  TTL: number;
}
