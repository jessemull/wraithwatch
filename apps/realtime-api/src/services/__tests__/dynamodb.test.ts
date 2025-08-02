import NodeCache from 'node-cache';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { EntityChange } from '../../types';

jest.mock('node-cache');
jest.mock('@aws-sdk/client-dynamodb');
jest.mock('@aws-sdk/lib-dynamodb');
jest.mock('../../utils/logger', () => ({
  createComponentLogger: jest.fn().mockReturnValue({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }),
}));

jest.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: {
    from: jest.fn(),
  },
  ScanCommand: jest.fn().mockImplementation(params => ({ input: params })),
  PutCommand: jest.fn().mockImplementation(params => ({ input: params })),
  BatchWriteCommand: jest
    .fn()
    .mockImplementation(params => ({ input: params })),
}));

const sendMock = jest.fn();
(DynamoDBDocumentClient.from as jest.Mock).mockReturnValue({
  send: sendMock,
});

import { DynamoDBService } from '../dynamodb';

describe('DynamoDBService', () => {
  let service: DynamoDBService;
  let mockDataCache: any;
  let mockPositionsCache: any;

  beforeEach(() => {
    mockDataCache = {
      get: jest.fn(),
      set: jest.fn(),
      flushAll: jest.fn(),
    };
    mockPositionsCache = {
      get: jest.fn(),
      set: jest.fn(),
      flushAll: jest.fn(),
    };

    (NodeCache as unknown as jest.Mock).mockImplementationOnce(
      () => mockDataCache
    );
    (NodeCache as unknown as jest.Mock).mockImplementationOnce(
      () => mockPositionsCache
    );

    // Reset the send mock for each test
    sendMock.mockClear();

    service = new DynamoDBService();
  });

  describe('getAllData', () => {
    it('returns cached data if available', async () => {
      mockDataCache.get.mockReturnValue([{ id: 1 }, { id: 2 }]);
      const result = await service.getAllData(1);
      expect(result).toEqual([{ id: 1 }]);
    });

    it('queries from DynamoDB and caches it on cache miss', async () => {
      mockDataCache.get.mockReturnValue(undefined);
      sendMock.mockResolvedValue({
        Items: [{ id: 1 }, { id: 2 }],
      });
      const result = await service.getAllData(2);
      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: 'wraithwatch-entity-changes',
          }),
        })
      );
      expect(mockDataCache.set).toHaveBeenCalledWith('all_data', [
        { id: 1 },
        { id: 2 },
      ]);
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('throws error on DynamoDB failure', async () => {
      mockDataCache.get.mockReturnValue(undefined);
      sendMock.mockRejectedValueOnce(new Error('fail'));
      await expect(service.getAllData()).rejects.toThrow('fail');
    });
  });

  describe('getRecentChanges', () => {
    // it('returns empty if no filters match', async () => {
    //   sendMock.mockResolvedValue({ Items: [] });
    //   const result = await service.getRecentChanges(5, ['nonexistent'], []);
    //   expect(result).toEqual([]);
    // });
    // it('filters changes and limits results', async () => {
    //   const items = [
    //     { entityType: 'user', entityId: '1', changeType: 'update', timestamp: 3 },
    //     { entityType: 'user', entityId: '2', changeType: 'create', timestamp: 2 },
    //     { entityType: 'order', entityId: '3', changeType: 'delete', timestamp: 1 },
    //   ];
    //   sendMock.mockResolvedValue({ Items: items });
    //   const result = await service.getRecentChanges(2, ['user'], ['create']);
    //   expect(result.length).toBe(1);
    //   expect(result[0]).toEqual(items[1]);
    // });
    //   it('returns limited sorted results with no filters', async () => {
    //     const items = [
    //       { entityType: 'user', timestamp: 1 },
    //       { entityType: 'user', timestamp: 3 },
    //       { entityType: 'user', timestamp: 2 },
    //     ];
    //     sendMock.mockResolvedValue({ Items: items });
    //     const result = await service.getRecentChanges(2, [], []);
    //     expect(result).toEqual([items[1], items[2]]);
    //   });
  });

  describe('preloadCache', () => {
    it('calls both getAllData and getAllEntityPositions', async () => {
      jest.spyOn(service, 'getAllData').mockResolvedValue([]);
      jest.spyOn(service, 'getAllEntityPositions').mockResolvedValue([]);
      await service.preloadCache();
      expect(service.getAllData).toHaveBeenCalled();
      expect(service.getAllEntityPositions).toHaveBeenCalled();
    });
  });

  describe('clearCache', () => {
    it('flushes both caches', () => {
      service.clearCache();
      expect(mockDataCache.flushAll).toHaveBeenCalled();
      expect(mockPositionsCache.flushAll).toHaveBeenCalled();
    });
  });

  describe('createEntityChange', () => {
    it('puts a single change to DynamoDB', async () => {
      sendMock.mockResolvedValue({});
      const change = {
        entityType: 'user',
        entityId: '1',
        changeType: 'update',
        data: {},
        timestamp: 1234,
      };
      await service.createEntityChange(change as unknown as EntityChange);
      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: 'wraithwatch-entity-changes',
            Item: change,
          }),
        })
      );
    });
  });

  describe('batchCreateEntityChanges', () => {
    it('sends changes in batches of 25', async () => {
      sendMock.mockResolvedValue({});
      const changes = Array.from({ length: 30 }, (_, i) => ({
        entityType: 'user',
        entityId: String(i),
        changeType: 'create',
        data: {},
        timestamp: i,
      }));
      await service.batchCreateEntityChanges(
        changes as unknown as EntityChange[]
      );
      expect(sendMock).toHaveBeenCalledTimes(2);
      expect(
        sendMock.mock.calls[0][0].input.RequestItems[
          'wraithwatch-entity-changes'
        ].length
      ).toBe(25);
      expect(
        sendMock.mock.calls[1][0].input.RequestItems[
          'wraithwatch-entity-changes'
        ].length
      ).toBe(5);
    });
  });

  describe('getAllEntityPositions', () => {
    it('returns cached positions', async () => {
      const mockData = [{ a: 1 }];
      mockPositionsCache.get.mockReturnValue(mockData);
      const result = await service.getAllEntityPositions();
      expect(result).toBe(mockData);
    });

    it('fetches from DynamoDB and caches if not cached', async () => {
      mockPositionsCache.get.mockReturnValue(undefined);
      sendMock.mockResolvedValue({ Items: [{ pos: 1 }] });
      const result = await service.getAllEntityPositions();
      expect(result).toEqual([{ pos: 1 }]);
      expect(mockPositionsCache.set).toHaveBeenCalledWith('all_positions', [
        { pos: 1 },
      ]);
    });

    it('throws error on DynamoDB error', async () => {
      mockPositionsCache.get.mockReturnValue(undefined);
      sendMock.mockRejectedValueOnce(new Error('fail'));
      await expect(service.getAllEntityPositions()).rejects.toThrow('fail');
    });
  });
});
