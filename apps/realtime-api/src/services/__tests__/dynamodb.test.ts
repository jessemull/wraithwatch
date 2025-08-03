// __tests__/dynamodb-service.test.ts

import { DynamoDBService } from '../dynamodb';
import { PutCommand, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

jest.mock('@aws-sdk/lib-dynamodb');

const mockDocClient = {
  send: jest.fn(),
};

jest.mock('@aws-sdk/lib-dynamodb', () => {
  const original = jest.requireActual('@aws-sdk/lib-dynamodb');
  return {
    ...original,
    DynamoDBDocumentClient: {
      from: () => mockDocClient,
    },
  };
});

describe('DynamoDBService', () => {
  let service: DynamoDBService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new DynamoDBService(mockDocClient as unknown as DynamoDBClient);
  });

  it('getAllData uses cache if available', async () => {
    const cacheData = [{ entity_id: '1' }];
    service['dataCache'].set('all_data', cacheData);

    const result = await service.getAllData();
    expect(result).toEqual(cacheData);
  });

  it('getAllData fetches and caches data if not cached', async () => {
    mockDocClient.send.mockResolvedValueOnce({ Items: [{ entity_id: '2' }] });

    const result = await service.getAllData();
    expect(result).toEqual([{ entity_id: '2' }]);
  });

  it('getAllEntityPositions uses cache if available', async () => {
    const cached = [{ entity_id: 'x' }];
    service['positionsCache'].set('all_positions', cached);
    const result = await service.getAllEntityPositions();
    expect(result).toEqual(cached);
  });

  it('getAllEntityPositions fetches if not cached', async () => {
    mockDocClient.send.mockResolvedValueOnce({
      Items: [{ PK: 'ENTITY_POSITION#x' }],
    });
    const result = await service.getAllEntityPositions();
    expect(result).toEqual([{ PK: 'ENTITY_POSITION#x' }]);
  });

  it('preloadCache sets both caches', async () => {
    mockDocClient.send.mockResolvedValueOnce({ Items: [{ entity_id: '3' }] });
    mockDocClient.send.mockResolvedValueOnce({
      Items: [{ PK: 'ENTITY_POSITION#y' }],
    });

    await service.preloadCache();
    expect(service['dataCache'].get('all_data')).toBeTruthy();
    expect(service['positionsCache'].get('all_positions')).toBeTruthy();
  });

  it('clearCache flushes caches', () => {
    const flushSpy1 = jest.spyOn(service['dataCache'], 'flushAll');
    const flushSpy2 = jest.spyOn(service['positionsCache'], 'flushAll');

    service.clearCache();
    expect(flushSpy1).toHaveBeenCalled();
    expect(flushSpy2).toHaveBeenCalled();
  });

  it('createEntityChange sends put command', async () => {
    const change = { entity_id: '4', timestamp: new Date().toISOString() };
    await service.createEntityChange(change as any);
    expect(mockDocClient.send).toHaveBeenCalledWith(expect.any(PutCommand));
  });

  it('batchCreateEntityChanges writes in batches', async () => {
    const changes = Array.from({ length: 3 }, (_, i) => ({
      entity_id: String(i),
    }));
    await service.batchCreateEntityChanges(changes as any);
    expect(mockDocClient.send).toHaveBeenCalledWith(
      expect.any(BatchWriteCommand)
    );
  });

  it('getRecentChanges handles no buckets', async () => {
    mockDocClient.send.mockResolvedValueOnce({ Items: [] });
    const result = await service.getRecentChanges();
    expect(result).toEqual([]);
  });

  it('getRecentChanges filters correctly', async () => {
    mockDocClient.send
      .mockResolvedValueOnce({ Items: [{ GSI2PK: 'time#1' }] })
      .mockResolvedValueOnce({
        Items: [
          {
            entity_id: '5',
            timestamp: new Date().toISOString(),
            entity_type: 'T',
          },
        ],
      });

    const result = await service.getRecentChanges({
      entityType: 'T',
      hours: 1,
    });
    expect(result.length).toBe(1);
  });

  it('performScan paginates', async () => {
    mockDocClient.send
      .mockResolvedValueOnce({
        Items: [{ entity_id: 'x' }],
        LastEvaluatedKey: { key: 1 },
      })
      .mockResolvedValueOnce({ Items: [{ entity_id: 'y' }] });

    const result = await service.getAllData(10);
    expect(result.length).toBe(2);
  });

  it('calculateCutoffTime returns date in past', () => {
    const past = service['calculateCutoffTime'](2);
    expect(past < new Date()).toBe(true);
  });
});
