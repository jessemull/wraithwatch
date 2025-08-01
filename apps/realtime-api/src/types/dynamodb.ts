export interface EntityChange {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;
  entity_id: string;
  entity_type: string;
  property_name: string;
  value: string | number;
  previous_value?: string | number;
  change_type: 'increase' | 'decrease' | 'change';
  timestamp: string;
  TTL: number;
}

export interface HistoricalDataQuery {
  entityId?: string;
  entityType?: string;
  propertyName?: string;
  startTime?: string;
  endTime?: string;
  limit?: number;
}
