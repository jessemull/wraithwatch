import { FastifyInstance } from 'fastify';
import routes from '../index';

describe('Routes', () => {
  let fastify: FastifyInstance;
  let mockDynamoDBService: any;
  let mockAggregatedMetricsService: any;
  let mockReply: any;

  beforeEach(() => {
    mockDynamoDBService = {
      getAllData: jest.fn(),
      getAllEntityPositions: jest.fn(),
    };

    mockAggregatedMetricsService = {
      calculateMetrics: jest.fn(),
    };

    mockReply = {
      status: jest.fn().mockReturnThis(),
    };

    fastify = {
      register: jest.fn(),
      get: jest.fn(),
    } as any;
  });

  it('should register health route', async () => {
    await routes(fastify, {
      dynamoDBService: mockDynamoDBService,
      aggregatedMetricsService: mockAggregatedMetricsService,
    });

    expect(fastify.register).toHaveBeenCalled();
  });

  it('should register test data route', async () => {
    await routes(fastify, {
      dynamoDBService: mockDynamoDBService,
      aggregatedMetricsService: mockAggregatedMetricsService,
    });

    expect(fastify.get).toHaveBeenCalledWith(
      '/api/test/data',
      expect.any(Function)
    );
  });

  it('should return data with default limit', async () => {
    const mockData = [{ id: '1', name: 'test' }];
    const mockPositions = [{ id: '1', x: 0, y: 0 }];
    const mockMetrics = { total: 1 };

    mockDynamoDBService.getAllData.mockResolvedValue(mockData);
    mockDynamoDBService.getAllEntityPositions.mockResolvedValue(mockPositions);
    mockAggregatedMetricsService.calculateMetrics.mockResolvedValue(
      mockMetrics
    );

    await routes(fastify, {
      dynamoDBService: mockDynamoDBService,
      aggregatedMetricsService: mockAggregatedMetricsService,
    });

    const routeHandler = (fastify.get as jest.Mock).mock.calls[0][1];
    const result = await routeHandler({ query: {} }, mockReply);

    expect(result).toEqual({
      success: true,
      data: mockData,
      positions: mockPositions,
      metrics: mockMetrics,
      count: 1,
      positionCount: 1,
    });
  });

  it('should return data with custom limit', async () => {
    const mockData = [{ id: '1', name: 'test' }];
    const mockPositions = [{ id: '1', x: 0, y: 0 }];
    const mockMetrics = { total: 1 };

    mockDynamoDBService.getAllData.mockResolvedValue(mockData);
    mockDynamoDBService.getAllEntityPositions.mockResolvedValue(mockPositions);
    mockAggregatedMetricsService.calculateMetrics.mockResolvedValue(
      mockMetrics
    );

    await routes(fastify, {
      dynamoDBService: mockDynamoDBService,
      aggregatedMetricsService: mockAggregatedMetricsService,
    });

    const routeHandler = (fastify.get as jest.Mock).mock.calls[0][1];
    const result = await routeHandler({ query: { limit: '10' } }, mockReply);

    expect(mockDynamoDBService.getAllData).toHaveBeenCalledWith(10);
    expect(result).toEqual({
      success: true,
      data: mockData,
      positions: mockPositions,
      metrics: mockMetrics,
      count: 1,
      positionCount: 1,
    });
  });

  it('should handle service errors', async () => {
    const testError = new Error('Database error');
    mockDynamoDBService.getAllData.mockRejectedValue(testError);

    await routes(fastify, {
      dynamoDBService: mockDynamoDBService,
      aggregatedMetricsService: mockAggregatedMetricsService,
    });

    const routeHandler = (fastify.get as jest.Mock).mock.calls[0][1];
    const result = await routeHandler({ query: {} }, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(result).toEqual({
      success: false,
      error: 'Database error',
    });
  });

  it('should handle unknown errors', async () => {
    mockDynamoDBService.getAllData.mockRejectedValue('Unknown error');

    await routes(fastify, {
      dynamoDBService: mockDynamoDBService,
      aggregatedMetricsService: mockAggregatedMetricsService,
    });

    const routeHandler = (fastify.get as jest.Mock).mock.calls[0][1];
    const result = await routeHandler({ query: {} }, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(result).toEqual({
      success: false,
      error: 'Unknown error',
    });
  });

  it('should handle empty data', async () => {
    const mockData: any[] = [];
    const mockPositions: any[] = [];
    const mockMetrics = { total: 0 };

    mockDynamoDBService.getAllData.mockResolvedValue(mockData);
    mockDynamoDBService.getAllEntityPositions.mockResolvedValue(mockPositions);
    mockAggregatedMetricsService.calculateMetrics.mockResolvedValue(
      mockMetrics
    );

    await routes(fastify, {
      dynamoDBService: mockDynamoDBService,
      aggregatedMetricsService: mockAggregatedMetricsService,
    });

    const routeHandler = (fastify.get as jest.Mock).mock.calls[0][1];
    const result = await routeHandler({ query: {} }, mockReply);

    expect(result).toEqual({
      success: true,
      data: [],
      positions: [],
      metrics: mockMetrics,
      count: 0,
      positionCount: 0,
    });
  });
});
