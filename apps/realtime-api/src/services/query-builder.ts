import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';

export class QueryBuilder {
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
