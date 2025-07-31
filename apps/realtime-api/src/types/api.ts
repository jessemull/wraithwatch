export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
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
