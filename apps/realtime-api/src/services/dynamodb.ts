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
import {
  AWS_REGION,
  DYNAMODB_TABLE_NAME,
  DYNAMODB_CONSTANTS,
} from '../constants';
import { EntityChange, RecentChangesOptions } from '../types/dynamodb';
import { createComponentLogger } from '../utils/logger';
import NodeCache from 'node-cache';

const logger = createComponentLogger('dynamodb-service');

// Initialize DynamoDB client with enhanced features...

const client = new DynamoDBClient({ region: AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export class DynamoDBService {
  private readonly tableName = DYNAMODB_TABLE_NAME;
  private dataCache: NodeCache;
  private positionsCache: NodeCache;

  constructor() {
    // Cache with very long TTL for demo (30 days)...

    this.dataCache = new NodeCache({ stdTTL: 30 * 24 * 60 * 60 });
    this.positionsCache = new NodeCache({ stdTTL: 30 * 24 * 60 * 60 });
  }

  // Get all data with pagination...

  async getAllData(
    limit: number = DYNAMODB_CONSTANTS.DEFAULT_SCAN_LIMIT
  ): Promise<EntityChange[]> {
    // Check cache first...

    const cachedData = this.dataCache.get<EntityChange[]>('all_data');
    if (cachedData) {
      logger.info('Returning cached data');
      return cachedData.slice(0, limit);
    }

    // If not in cache, fetch from database...

    const allItems: EntityChange[] = [];
    let lastEvaluatedKey: Record<string, unknown> | undefined = undefined;

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

      // Cache the data...

      this.dataCache.set('all_data', allItems);
      logger.info('Cached all data');

      return allItems;
    } catch (error) {
      this.logError('Error scanning table for all data', { error });
      throw error;
    }
  }

  // Get entity history with flexible filtering...
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

  async getAllEntityPositions(): Promise<any[]> {
    // Check cache first...

    const cachedPositions = this.positionsCache.get<any[]>('all_positions');
    if (cachedPositions) {
      logger.info('Returning cached positions');
      return cachedPositions;
    }

    // If not in cache, fetch from database...

    try {
      const allItems: any[] = [];
      let lastEvaluatedKey: Record<string, unknown> | undefined = undefined;

      do {
        const scanParams: ScanCommandInput = {
          TableName: this.tableName,
          FilterExpression: 'begins_with(PK, :pkPrefix)',
          ExpressionAttributeValues: {
            ':pkPrefix': 'ENTITY_POSITION#',
          },
          ...(lastEvaluatedKey && { ExclusiveStartKey: lastEvaluatedKey }),
        };

        const response = await docClient.send(new ScanCommand(scanParams));
        const items = response.Items || [];
        allItems.push(...items);
        lastEvaluatedKey = response.LastEvaluatedKey;

        this.logScanProgress(items.length, allItems.length, !!lastEvaluatedKey);
      } while (lastEvaluatedKey);

      this.logScanCompletion(allItems.length);

      // Cache the positions...

      this.positionsCache.set('all_positions', allItems);
      logger.info('Cached all positions');

      return allItems;
    } catch (error) {
      this.logError('Error scanning table for entity positions', { error });
      throw error;
    }
  }

  // Preload cache with all data...

  async preloadCache(): Promise<void> {
    try {
      logger.info('Preloading cache with all data...');

      // Preload data cache...

      const allData = await this.getAllData();
      this.dataCache.set('all_data', allData);

      // Preload positions cache...

      const allPositions = await this.getAllEntityPositions();
      this.positionsCache.set('all_positions', allPositions);

      logger.info('Cache preloaded successfully');
    } catch (error) {
      this.logError('Error preloading cache', { error });
      throw error;
    }
  }

  // Clear cache if needed...

  clearCache(): void {
    this.dataCache.flushAll();
    this.positionsCache.flushAll();
    logger.info('Cache cleared');
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
    lastEvaluatedKey: Record<string, unknown> | undefined,
    limit: number
  ): Promise<{
    items: EntityChange[];
    lastEvaluatedKey?: Record<string, unknown>;
  }> {
    const scanParams: ScanCommandInput = {
      TableName: this.tableName,
      FilterExpression: 'NOT begins_with(PK, :pkPrefix)',
      ExpressionAttributeValues: {
        ':pkPrefix': 'ENTITY_POSITION#',
      },
      Limit: Math.min(DYNAMODB_CONSTANTS.SCAN_LIMIT, limit),
      ExclusiveStartKey: lastEvaluatedKey,
    };

    const response = await docClient.send(new ScanCommand(scanParams));
    return {
      items: (response.Items as EntityChange[]) || [],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
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

  private logError(message: string, context: Record<string, unknown>): void {
    logger.error(context, message);
  }
}

// Query Builder helper class...

class QueryBuilder {
  private keyConditionExpression: string;
  private expressionAttributeValues: Record<string, unknown>;
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
