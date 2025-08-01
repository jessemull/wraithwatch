import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  ScanCommand,
  PutCommand,
  BatchWriteCommand,
  QueryCommandInput,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { AWS_REGION, DYNAMODB_TABLE_NAME, DYNAMODB_CONSTANTS } from '../constants';
import { 
  EntityChange, 
  QueryOptions, 
  RecentChangesOptions, 
  EntitySummary, 
  PropertySummary 
} from '../types/dynamodb';
import { createComponentLogger } from '../utils/logger';

const logger = createComponentLogger('dynamodb-service');

// Initialize DynamoDB client with enhanced features...

const client = new DynamoDBClient({ region: AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export class DynamoDBService {
  private readonly tableName = DYNAMODB_TABLE_NAME;

  // Get all data with pagination...

  async getAllData(
    limit: number = DYNAMODB_CONSTANTS.DEFAULT_SCAN_LIMIT
  ): Promise<EntityChange[]> {
    const allItems: EntityChange[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;

    try {
      do {
        const scanResult = await this.performScan(
          lastEvaluatedKey,
          limit - allItems.length
        );
        allItems.push(...scanResult.items);
        lastEvaluatedKey = scanResult.lastEvaluatedKey;

        this.logScanProgress(
          scanResult.items.length,
          allItems.length,
          !!lastEvaluatedKey
        );
      } while (lastEvaluatedKey && allItems.length < limit);

      this.logScanCompletion(allItems.length);
      return allItems;
    } catch (error) {
      this.logError('Error scanning table for all data', { error });
      throw error;
    }
  }

  // Get entity history with flexible filtering...

  async getEntityHistory(
    entityId: string,
    options?: QueryOptions
  ): Promise<EntityChange[]> {
    const {
      propertyName,
      startTime,
      endTime,
      limit = DYNAMODB_CONSTANTS.DEFAULT_QUERY_LIMIT,
    } = options || {};

    if (this.shouldUsePropertyFilter(propertyName, startTime, endTime)) {
      return this.getEntityHistoryWithPropertyFilter(
        entityId,
        propertyName!,
        limit
      );
    }

    try {
      const queryParams = this.buildEntityHistoryQuery(entityId, {
        propertyName,
        startTime,
        endTime,
        limit,
      });
      const response = await docClient.send(new QueryCommand(queryParams));
      return (response.Items as EntityChange[]) || [];
    } catch (error) {
      this.logError('Error querying entity history', { error, entityId });
      throw error;
    }
  }

  // Get recent changes using GSI2...

  async getRecentChanges(
    options?: RecentChangesOptions
  ): Promise<EntityChange[]> {
    const {
      entityType,
      limit = DYNAMODB_CONSTANTS.DEFAULT_QUERY_LIMIT,
      hours,
    } = options || {};

    try {
      const mostRecentBucket = await this.findMostRecentTimeBucket();

      if (!mostRecentBucket) {
        logger.warn('No time buckets found in data');
        return [];
      }

      logger.info({ mostRecentBucket }, 'Found most recent time bucket');

      const items = await this.queryRecentChanges(mostRecentBucket, limit);
      return this.filterAndSortRecentChanges(items, {
        entityType,
        hours,
        limit,
      });
    } catch (error) {
      this.logError('Error querying recent changes', { error });
      throw error;
    }
  }

  // Get property history...

  async getPropertyHistory(
    entityId: string,
    propertyName: string,
    options?: Omit<QueryOptions, 'propertyName'>
  ): Promise<EntityChange[]> {
    return this.getEntityHistory(entityId, {
      propertyName,
      ...options,
    });
  }

  // Get entity summary...

  async getEntitySummary(entityId: string): Promise<EntitySummary> {
    const changes = await this.getEntityHistory(entityId, {
      limit: DYNAMODB_CONSTANTS.ENTITY_SUMMARY_LIMIT,
    });

    if (changes.length === 0) {
      throw new Error(`No data found for entity: ${entityId}`);
    }

    return this.buildEntitySummary(entityId, changes);
  }

  // Helper method to create a new entity change...

  async createEntityChange(change: EntityChange): Promise<void> {
    try {
      await docClient.send(
        new PutCommand({
          TableName: this.tableName,
          Item: change,
        })
      );
      logger.info({ entityId: change.entity_id }, 'Entity change created');
    } catch (error) {
      this.logError('Error creating entity change', { error, change });
      throw error;
    }
  }

  // Helper method to batch write entity changes...

  async batchCreateEntityChanges(changes: EntityChange[]): Promise<void> {
    try {
      const batches = this.createBatches(
        changes,
        DYNAMODB_CONSTANTS.BATCH_WRITE_LIMIT
      );

      for (let i = 0; i < batches.length; i++) {
        await this.writeBatch(batches[i]);
        this.logBatchProgress(i + 1, batches.length, batches[i].length);
      }
    } catch (error) {
      this.logError('Error in batch write', { error });
      throw error;
    }
  }

  // Private helper methods...

  private async performScan(
    lastEvaluatedKey: Record<string, any> | undefined,
    limit: number
  ): Promise<{
    items: EntityChange[];
    lastEvaluatedKey?: Record<string, any>;
  }> {
    const scanParams: ScanCommandInput = {
      TableName: this.tableName,
      Limit: Math.min(DYNAMODB_CONSTANTS.SCAN_LIMIT, limit),
      ExclusiveStartKey: lastEvaluatedKey,
    };

    const response = await docClient.send(new ScanCommand(scanParams));
    return {
      items: (response.Items as EntityChange[]) || [],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  }

  private shouldUsePropertyFilter(
    propertyName?: string,
    startTime?: string,
    endTime?: string
  ): boolean {
    return Boolean(propertyName && !startTime && !endTime);
  }

  private async getEntityHistoryWithPropertyFilter(
    entityId: string,
    propertyName: string,
    limit: number
  ): Promise<EntityChange[]> {
    try {
      const queryParams: QueryCommandInput = {
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :propertyPrefix)',
        ExpressionAttributeValues: {
          ':pk': this.buildEntityKey(entityId),
          ':propertyPrefix': `#${propertyName}`,
        },
        ScanIndexForward: false,
        Limit: limit,
      };

      const response = await docClient.send(new QueryCommand(queryParams));
      return (response.Items as EntityChange[]) || [];
    } catch (error) {
      this.logError('Error querying property history', {
        error,
        entityId,
        propertyName,
      });
      throw error;
    }
  }

  private buildEntityHistoryQuery(
    entityId: string,
    options: QueryOptions
  ): QueryCommandInput {
    const {
      propertyName,
      startTime,
      endTime,
      limit = DYNAMODB_CONSTANTS.DEFAULT_QUERY_LIMIT,
    } = options;

    const queryBuilder = new QueryBuilder();
    queryBuilder.setPartitionKey(this.buildEntityKey(entityId));

    if (propertyName) {
      this.addPropertyTimeFilters(
        queryBuilder,
        propertyName,
        startTime,
        endTime
      );
    } else {
      this.addTimeFilters(queryBuilder, startTime, endTime);
    }

    return queryBuilder.build({
      tableName: this.tableName,
      limit,
      scanIndexForward: false,
    });
  }

  private addPropertyTimeFilters(
    queryBuilder: QueryBuilder,
    propertyName: string,
    startTime?: string,
    endTime?: string
  ): void {
    if (startTime) {
      queryBuilder.addSortKeyCondition('>=', `${startTime}#${propertyName}`);
    }
    if (endTime) {
      queryBuilder.addSortKeyCondition('<=', `${endTime}#${propertyName}~`);
    }
  }

  private addTimeFilters(
    queryBuilder: QueryBuilder,
    startTime?: string,
    endTime?: string
  ): void {
    if (startTime) {
      queryBuilder.addSortKeyCondition('>=', `${startTime}#`);
    }
    if (endTime) {
      queryBuilder.addSortKeyCondition('<=', `${endTime}#~`);
    }
  }

  private async findMostRecentTimeBucket(): Promise<string | null> {
    const scanParams: ScanCommandInput = {
      TableName: this.tableName,
      ProjectionExpression: 'GSI2PK',
      Select: 'SPECIFIC_ATTRIBUTES',
    };

    const scanResponse = await docClient.send(new ScanCommand(scanParams));
    const timeBuckets = new Set<string>();

    (scanResponse.Items || []).forEach(item => {
      if (item.GSI2PK) {
        timeBuckets.add(item.GSI2PK);
      }
    });

    const sortedBuckets = Array.from(timeBuckets).sort().reverse();
    return sortedBuckets[0] || null;
  }

  private async queryRecentChanges(
    timeBucket: string,
    limit: number
  ): Promise<EntityChange[]> {
    const queryParams: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: DYNAMODB_CONSTANTS.INDEX_NAME,
      KeyConditionExpression: 'GSI2PK = :timeBucket',
      ExpressionAttributeValues: {
        ':timeBucket': timeBucket,
      },
      ScanIndexForward: false,
      Limit: limit,
    };

    const response = await docClient.send(new QueryCommand(queryParams));
    return (response.Items as EntityChange[]) || [];
  }

  private filterAndSortRecentChanges(
    items: EntityChange[],
    options: RecentChangesOptions
  ): EntityChange[] {
    let filteredItems = items;

    // Filter by entity type if specified...

    if (options.entityType) {
      filteredItems = filteredItems.filter(
        item => item.entity_type === options.entityType
      );
    }

    // Filter by time range if specified...

    if (options.hours && options.hours > 0) {
      const cutoffTime = this.calculateCutoffTime(options.hours);
      filteredItems = filteredItems.filter(
        item => new Date(item.timestamp) >= cutoffTime
      );
    }

    // Sort by timestamp (most recent first)...

    filteredItems.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return filteredItems.slice(
      0,
      options.limit || DYNAMODB_CONSTANTS.DEFAULT_QUERY_LIMIT
    );
  }

  private buildEntitySummary(
    entityId: string,
    changes: EntityChange[]
  ): EntitySummary {
    const entityType = changes[0].entity_type;
    const properties = this.aggregatePropertyChanges(changes);

    return {
      entityId,
      entityType,
      properties,
    };
  }

  private aggregatePropertyChanges(
    changes: EntityChange[]
  ): Record<string, PropertySummary> {
    const properties: Record<string, PropertySummary> = {};

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
        this.isMoreRecent(
          change.timestamp,
          properties[change.property_name].lastChange
        )
      ) {
        properties[change.property_name].currentValue = change.value;
        properties[change.property_name].lastChange = change.timestamp;
      }
    });

    return properties;
  }

  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  private async writeBatch(changes: EntityChange[]): Promise<void> {
    const writeRequests = changes.map(change => ({
      PutRequest: { Item: change },
    }));

    await docClient.send(
      new BatchWriteCommand({
        RequestItems: { [this.tableName]: writeRequests },
      })
    );
  }

  // Utility methods...


  private buildEntityKey(entityId: string): string {
    return `ENTITY#${entityId}`;
  }

  private calculateCutoffTime(hours: number): Date {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hours);
    return cutoffTime;
  }

  private isMoreRecent(timestamp1: string, timestamp2: string): boolean {
    return new Date(timestamp1) > new Date(timestamp2);
  }

  // Logging methods...

  private logScanProgress(
    batchCount: number,
    totalCount: number,
    hasMore: boolean
  ): void {
    logger.info({ batchCount, totalCount, hasMore }, 'Scan batch completed');
  }

  private logScanCompletion(totalCount: number): void {
    logger.info({ totalCount }, 'Scan completed, total items found');
  }

  private logBatchProgress(
    batchNumber: number,
    totalBatches: number,
    batchSize: number
  ): void {
    logger.info(
      { batchNumber, totalBatches, batchSize },
      'Batch write completed'
    );
  }

  private logError(message: string, context: Record<string, any>): void {
    logger.error(context, message);
  }
}

// Query Builder helper class...

class QueryBuilder {
  private keyConditionExpression: string;
  private expressionAttributeValues: Record<string, any>;
  private sortKeyConditions: string[];

  constructor() {
    this.keyConditionExpression = '';
    this.expressionAttributeValues = {};
    this.sortKeyConditions = [];
  }

  setPartitionKey(pk: string): void {
    this.keyConditionExpression = 'PK = :pk';
    this.expressionAttributeValues[':pk'] = pk;
  }

  addSortKeyCondition(operator: string, value: string): void {
    const condition = `SK ${operator} :sk${this.sortKeyConditions.length}`;
    this.sortKeyConditions.push(condition);
    this.expressionAttributeValues[`:sk${this.sortKeyConditions.length - 1}`] =
      value;
  }

  build(options: {
    tableName: string;
    limit: number;
    scanIndexForward: boolean;
  }): QueryCommandInput {
    const keyConditionExpression = [
      this.keyConditionExpression,
      ...this.sortKeyConditions,
    ].join(' AND ');

    return {
      TableName: options.tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: this.expressionAttributeValues,
      ScanIndexForward: options.scanIndexForward,
      Limit: options.limit,
    };
  }
}
