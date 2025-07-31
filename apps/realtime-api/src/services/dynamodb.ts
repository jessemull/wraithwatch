import {
  DynamoDBClient,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { EntityChange } from '../types/dynamodb';
import { createComponentLogger } from '../utils/logger';
import { AWS_REGION, DYNAMODB_TABLE_NAME } from '../constants';

const logger = createComponentLogger('dynamodb-service');

const client = new DynamoDBClient({ region: AWS_REGION });

export class DynamoDBService {
  private tableName = DYNAMODB_TABLE_NAME;

  /**
   * Simple scan to get all data (for testing)
   */
  async getAllData(limit: number = 10): Promise<EntityChange[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
      Limit: limit,
    });

    try {
      const response = await client.send(command);
      return (response.Items || []).map(item =>
        unmarshall(item)
      ) as EntityChange[];
    } catch (error) {
      logger.error({ error }, 'Error scanning table');
      throw error;
    }
  }

  /**
   * Get historical changes for a specific entity
   */
  async getEntityHistory(
    entityId: string,
    options?: {
      propertyName?: string;
      startTime?: string;
      endTime?: string;
      limit?: number;
    }
  ): Promise<EntityChange[]> {
    const { propertyName, startTime, endTime, limit = 100 } = options || {};

    // If we have a property filter but no time range, we need to use a scan with filter
    if (propertyName && !startTime && !endTime) {
      return this.getEntityHistoryWithPropertyFilter(
        entityId,
        propertyName,
        limit
      );
    }

    let keyConditionExpression = 'PK = :pk';
    const expressionAttributeValues: Record<string, { S: string }> = {
      ':pk': { S: `ENTITY#${entityId}` },
    };

    // Add property filter if specified
    if (propertyName) {
      // For property-specific queries with time range
      if (startTime) {
        keyConditionExpression += ' AND SK >= :startTime';
        expressionAttributeValues[':startTime'] = {
          S: `${startTime}#${propertyName}`,
        };
      }
      if (endTime) {
        keyConditionExpression += ' AND SK <= :endTime';
        expressionAttributeValues[':endTime'] = {
          S: `${endTime}#${propertyName}~`,
        };
      }
    } else if (startTime) {
      keyConditionExpression += ' AND SK >= :startTime';
      expressionAttributeValues[':startTime'] = { S: `${startTime}#` };
    }

    // Add end time filter for non-property queries
    if (endTime && !propertyName) {
      keyConditionExpression += ' AND SK <= :endTime';
      expressionAttributeValues[':endTime'] = { S: `${endTime}#~` };
    }

    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ScanIndexForward: false, // Most recent first
      Limit: limit,
    });

    try {
      const response = await client.send(command);
      return (response.Items || []).map(item =>
        unmarshall(item)
      ) as EntityChange[];
    } catch (error) {
      logger.error({ error, entityId }, 'Error querying entity history');
      throw error;
    }
  }

  /**
   * Get entity history with property filter using scan
   */
  private async getEntityHistoryWithPropertyFilter(
    entityId: string,
    propertyName: string,
    limit: number
  ): Promise<EntityChange[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'PK = :pk AND contains(SK, :propertySuffix)',
      ExpressionAttributeValues: {
        ':pk': { S: `ENTITY#${entityId}` },
        ':propertySuffix': { S: `#${propertyName}` },
      },
      Limit: limit,
    });

    try {
      const response = await client.send(command);
      const items = (response.Items || []).map(item =>
        unmarshall(item)
      ) as EntityChange[];

      // Sort by timestamp (most recent first)
      items.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return items.slice(0, limit);
    } catch (error) {
      logger.error(
        { error, entityId, propertyName },
        'Error scanning entity history with property filter'
      );
      throw error;
    }
  }

  /**
   * Get recent changes across all entities
   */
  async getRecentChanges(options?: {
    entityType?: string;
    limit?: number;
    hours?: number;
  }): Promise<EntityChange[]> {
    const { entityType, limit = 100, hours } = options || {};

    // For demo data, we'll get all data and filter by hours if specified
    // Since demo data might be from the future, we'll get everything and sort by timestamp
    const command = new ScanCommand({
      TableName: this.tableName,
      Limit: limit * 2, // Get more items to account for filtering
    });

    try {
      const response = await client.send(command);
      let items = (response.Items || []).map(item =>
        unmarshall(item)
      ) as EntityChange[];

      // Filter by entity type if specified
      if (entityType) {
        items = items.filter(item => item.entity_type === entityType);
      }

      // Filter by time range if specified (only if hours is provided and > 0)
      if (hours && hours > 0) {
        const cutoffTime = new Date();
        cutoffTime.setHours(cutoffTime.getHours() - hours);
        items = items.filter(item => new Date(item.timestamp) >= cutoffTime);
      }

      // Sort by timestamp (most recent first)
      items.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return items.slice(0, limit);
    } catch (error) {
      logger.error({ error }, 'Error scanning recent changes');
      throw error;
    }
  }

  /**
   * Get property history for a specific entity and property
   */
  async getPropertyHistory(
    entityId: string,
    propertyName: string,
    options?: {
      startTime?: string;
      endTime?: string;
      limit?: number;
    }
  ): Promise<EntityChange[]> {
    return this.getEntityHistory(entityId, {
      propertyName,
      ...options,
    });
  }

  /**
   * Get summary statistics for an entity
   */
  async getEntitySummary(entityId: string): Promise<{
    entityId: string;
    entityType: string;
    properties: Record<
      string,
      {
        currentValue: string | number;
        changeCount: number;
        lastChange: string;
      }
    >;
  }> {
    const changes = await this.getEntityHistory(entityId, { limit: 1000 });

    if (changes.length === 0) {
      throw new Error(`No data found for entity: ${entityId}`);
    }

    const entityType = changes[0].entity_type;
    const properties: Record<
      string,
      {
        currentValue: string | number;
        changeCount: number;
        lastChange: string;
      }
    > = {};

    // Group by property and find current values
    changes.forEach(change => {
      if (!properties[change.property_name]) {
        properties[change.property_name] = {
          currentValue: change.value,
          changeCount: 0,
          lastChange: change.timestamp,
        };
      }
      properties[change.property_name].changeCount++;
      if (
        new Date(change.timestamp) >
        new Date(properties[change.property_name].lastChange)
      ) {
        properties[change.property_name].currentValue = change.value;
        properties[change.property_name].lastChange = change.timestamp;
      }
    });

    return {
      entityId,
      entityType,
      properties,
    };
  }
}
