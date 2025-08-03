// queryBuilder.test.ts

import { QueryBuilder } from '../query-builder';
import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';

describe('QueryBuilder', () => {
  let builder: QueryBuilder;

  beforeEach(() => {
    builder = new QueryBuilder();
  });

  test('initial state is correct', () => {
    const result = (builder as any);
    expect(result.keyConditionExpression).toBe('');
    expect(result.expressionAttributeValues).toEqual({});
    expect(result.sortKeyConditions).toEqual([]);
  });

  test('setPartitionKey sets the correct expression and value', () => {
    builder.setPartitionKey('user#123');
    const result = (builder as any);

    expect(result.keyConditionExpression).toBe('PK = :pk');
    expect(result.expressionAttributeValues).toEqual({
      ':pk': 'user#123',
    });
  });

  test('addSortKeyCondition adds multiple sort key conditions with correct operators and values', () => {
    builder.setPartitionKey('user#123');
    builder.addSortKeyCondition('=', 'order#1');
    builder.addSortKeyCondition('>', 'order#2');

    const result = (builder as any);

    expect(result.sortKeyConditions).toEqual([
      'SK = :sk0',
      'SK > :sk1',
    ]);

    expect(result.expressionAttributeValues).toEqual({
      ':pk': 'user#123',
      ':sk0': 'order#1',
      ':sk1': 'order#2',
    });
  });

  test('build returns the correct QueryCommandInput structure', () => {
    builder.setPartitionKey('user#123');
    builder.addSortKeyCondition('BETWEEN', 'order#5');

    const options = {
      tableName: 'TestTable',
      limit: 25,
      scanIndexForward: true,
    };

    const expected: QueryCommandInput = {
      TableName: 'TestTable',
      KeyConditionExpression: 'PK = :pk AND SK BETWEEN :sk0',
      ExpressionAttributeValues: {
        ':pk': 'user#123',
        ':sk0': 'order#5',
      },
      ScanIndexForward: true,
      Limit: 25,
    };

    const result = builder.build(options);
    expect(result).toEqual(expected);
  });
});
