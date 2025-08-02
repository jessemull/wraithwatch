import { DynamoDBService } from '../services/dynamodb';
import { AggregatedMetricsService } from '../services/aggregated-metrics';

export interface RouteOptions {
  dynamoDBService: DynamoDBService;
  aggregatedMetricsService: AggregatedMetricsService;
}

export interface HistoryRouteOptions {
  dynamoDBService: DynamoDBService;
}

export interface SummaryRouteOptions {
  dynamoDBService: DynamoDBService;
}
