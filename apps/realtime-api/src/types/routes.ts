import { DynamoDBService } from '../services/dynamodb';

export interface RouteOptions {
  dynamoDBService: DynamoDBService;
}

export interface HistoryRouteOptions {
  dynamoDBService: DynamoDBService;
}

export interface SummaryRouteOptions {
  dynamoDBService: DynamoDBService;
}
