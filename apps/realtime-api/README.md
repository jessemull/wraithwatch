# Wraithwatch Realtime API

A high-performance WebSocket server built with Fastify and TypeScript, designed to provide real-time entity updates and data streaming for the Wraithwatch cybersecurity dashboard. The server mocks data streams from services like AWS Kinesis and delivers real-time updates via WebSockets and REST APIs.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [WebSocket Communication](#websocket-communication)
- [Database Schema](#database-schema)
- [Development](#development)
- [Deployment](#deployment)
- [Performance Optimization](#performance-optimization)
- [Monitoring & Logging](#monitoring--logging)
- [Security](#security)
- [Future Improvements](#future-improvements)

## Overview

The Wraithwatch Realtime API provides real-time data streaming capabilities for the cybersecurity dashboard, simulating production data streams from services like AWS Kinesis. The server generates continuous entity updates and delivers them via WebSocket connections and REST APIs, enabling real-time threat monitoring and entity tracking.

## Features

### Real-time Communication

- **WebSocket Server**: Real-time bidirectional communication
- **Entity Updates**: Continuous entity property changes
- **Connection Management**: Client connection tracking
- **Broadcast Messaging**: Efficient message broadcasting

### Data Management

- **Entity Management**: Entity lifecycle and property tracking
- **Time-series Data**: Historical entity property changes
- **Data Aggregation**: Real-time metrics calculation
- **Cache Management**: In-memory caching with TTL

### Database Integration

- **DynamoDB Integration**: AWS DynamoDB for data persistence
- **Entity Positions**: Spatial entity positioning data
- **Property History**: Time-series property value tracking
- **Data Transformation**: Database to entity mapping

### Performance Features

- **Fastify Framework**: High-performance HTTP server
- **WebSocket Optimization**: Efficient WebSocket handling
- **Caching Strategy**: Multi-layer caching system
- **Memory Management**: Optimized memory usage

## Technology Stack

### Core Platform

- **Node.js 22**: Latest LTS runtime
- **TypeScript**: Type-safe development
- **Fastify**: High-performance HTTP framework

### WebSocket & Communication

- **WebSocket**: Real-time bidirectional communication
- **ws Library**: WebSocket server implementation
- **Connection Management**: Client tracking and broadcasting

### Database & Storage

- **AWS DynamoDB**: NoSQL database for entity data
- **AWS SDK v3**: DynamoDB client and operations
- **Node-cache**: In-memory caching layer

### Development Tools

- **Jest**: Testing framework
- **ESLint**: Code linting

### CI/CD

- **GitHub Actions**: Deployment workflows
- **AWS ECR**: Container registry
- **ECS Fargate**: Container orchestration
- **CloudFormation**: Infrastructure management
- **Webpack**: Bundle optimization
- **Docker**: Containerization

## Quick Start

### Prerequisites

- Node.js 22+
- AWS CLI configured
- DynamoDB table with entity data
- Docker (for containerized deployment)

### Installation

1. **Install dependencies**

   ```bash
   yarn install
   ```

2. **Set environment variables**

   ```bash
   # Edit .env with environment variables (see below)
   touch .env
   ```

3. **Start development server**

   ```bash
   yarn dev
   ```

4. **Test the API**

   ```bash
   # Health check
   curl http://localhost:8080/health

   # Test data endpoint
   curl http://localhost:8080/api/test/data

   # Test WebSocket connection (requires wscat)
   wscat -c ws://localhost:8080/ws
   ```

## Project Structure

```
apps/realtime-api/
├── src/
│   ├── __tests__/           # Test files
│   ├── constants/           # Application constants
│   ├── plugins/             # Fastify plugins
│   ├── routes/              # REST API routes
│   ├── services/            # Business logic services
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── index.ts             # Application entry point
│   └── server.ts            # Server configuration
├── Dockerfile               # Container configuration
├── webpack.config.js        # Bundle configuration
└── package.json             # Dependencies and scripts
```

## API Endpoints

### Health Check

```http
GET https://api.wraithwatch-demo.com/api/health
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test Data

```http
GET https://api.wraithwatch-demo.com/api/test/data?limit=5
```

**Response:**

```json
{
  "success": true,
  "data": [...],
  "positions": [...],
  "metrics": {...},
  "count": 5,
  "positionCount": 10
}
```

## WebSocket Communication

### Connection

```javascript
const ws = new WebSocket('ws://localhost:8080/ws');
```

### Message Types

#### Entity Updates

```json
{
  "type": "entity_update",
  "entityId": "entity-123",
  "propertyName": "threat_level",
  "oldValue": "medium",
  "newValue": "high",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Entity List

```json
{
  "type": "entity_list",
  "entities": [
    {
      "id": "entity-123",
      "type": "server",
      "properties": {
        "threat_level": "high",
        "status": "active"
      }
    }
  ]
}
```

#### Connection Status

```json
{
  "type": "connection_status",
  "clientCount": 5,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Database Schema

### Single Table Design

For simplicity in this demo, we use a single DynamoDB table (`wraithwatch-entity-changes`) with different key schemas to store both entity changes and positions. This approach reduces complexity while demonstrating effective data modeling patterns.

### Entity Changes (Time-Series Data)

Each record represents a single event from a data stream, capturing property changes over time:

```typescript
interface EntityChange {
  PK: string; // entity_id
  SK: string; // timestamp#version
  GSI1PK: string; // entity_type
  GSI1SK: string; // timestamp
  GSI2PK: string; // property_name
  GSI2SK: string; // timestamp
  entity_id: string; // Entity identifier
  entity_type: string; // System, User, Sensor, Threat, AI_Agent, Network_Node
  property_name: string; // Property that changed
  value: string | number; // New property value
  previous_value?: string | number; // Previous property value
  change_type: 'increase' | 'decrease' | 'change'; // Type of change
  timestamp: string; // ISO timestamp
  TTL: number; // Expiration timestamp
}
```

### Entity Positions (Spatial Data)

Positions are stored separately from entity data to avoid re-rendering client 3D visualizations when entity properties change:

```typescript
interface EntityPosition {
  PK: string; // ENTITY_POSITION#entity_id
  SK: string; // Position type (timeline/network/matrix)
  entity_id: string; // Entity identifier
  position: {
    // 3D coordinates
    x: number;
    y: number;
    z: number;
  };
  matrix_position?: {
    // Matrix-specific positioning
    x: number;
    y: number;
    z: number;
  };
  network_position?: {
    // Network-specific positioning
    x: number;
    y: number;
    z: number;
  };
  timeline_position?: {
    // Timeline-specific positioning
    x: number;
    y: number;
    z: number;
  };
  TTL: number; // Expiration timestamp
}
```

### Key Design Patterns

- **Single Table**: Uses one table with different key schemas for simplicity
- **Separate Positions**: Entity positions stored separately to optimize 3D rendering
- **Time-Series Events**: Each record represents a single event from a data stream
- **Runtime Aggregation**: Due to time constraints, data is aggregated at runtime rather than pre-computed
- **GSI Optimization**: Multiple Global Secondary Indexes for efficient querying
- **TTL Management**: Automatic expiration for demo data management

## Development

### Available Scripts

```bash
# Development
yarn dev              # Start development server
yarn build            # Build TypeScript
yarn build:prod       # Build for production with Webpack
yarn start            # Start production server
yarn start:prod       # Start bundled production server
yarn clean            # Clean build artifacts

# Testing
yarn test             # Run unit tests
yarn test:watch       # Run tests in watch mode
yarn test:coverage    # Generate coverage report
yarn coverage:open    # Open coverage report

# Code Quality
yarn lint             # Run ESLint
```

### Environment Variables

```bash
# Required
AWS_REGION=us-east-1
DYNAMODB_TABLE_NAME=wraithwatch-entities

# Optional
PORT=8080
HOST=0.0.0.0
NODE_ENV=production
LOG_LEVEL=info
UPDATE_INTERVAL=2000
```

### Development Workflow

1. **Start development server**

   ```bash
   yarn dev
   ```

2. **Run tests**

   ```bash
   yarn test
   ```

3. **Check code quality**

   ```bash
   yarn lint
   ```

4. **Build for production**
   ```bash
   yarn build:prod
   ```

## Deployment

### GitHub Actions Deployment

The Realtime API is deployed via GitHub Actions workflow and AWS ECS Fargate:

1. **Manual Trigger**: Deploy via GitHub Actions workflow dispatch
2. **Build Process**:
   - Install dependencies
   - Lint code
   - Run unit tests
   - Check coverage threshold (70%)
   - Build TypeScript
   - Build Docker image
   - Push to ECR

3. **ECS Deployment**:
   - Update ECS task definition
   - Deploy to ECS Fargate
   - Update load balancer
   - Set environment variables

## Infrastructure Components

- **ECS Fargate**: Container orchestration with auto-scaling
- **Application Load Balancer**: HTTP/WebSocket load balancing
- **DynamoDB**: Entity data storage and time-series data
- **CloudWatch**: Logging and monitoring
- **ECR**: Container image registry
- **CloudFormation**: Infrastructure management

## Performance Optimization

### Server Optimization

- **Fastify Framework**: High-performance HTTP server
- **WebSocket Optimization**: Efficient WebSocket handling
- **Memory Management**: Optimized memory usage
- **Connection Pooling**: Efficient connection management

### Caching Strategy

- **Multi-layer Caching**: In-memory and database caching
- **TTL Management**: Configurable cache expiration
- **Cache Invalidation**: Intelligent cache invalidation
- **Memory Monitoring**: Cache size monitoring

### Database Optimization

- **DynamoDB Optimization**: Efficient query patterns
- **Connection Pooling**: Database connection management
- **Query Optimization**: Optimized DynamoDB queries
- **Batch Operations**: Efficient batch processing

### WebSocket Optimization

- **Connection Management**: Efficient client tracking
- **Message Broadcasting**: Optimized message delivery
- **Memory Usage**: Minimal memory footprint
- **Error Handling**: Graceful error recovery

## Monitoring & Logging

### CloudWatch Monitoring

- **ECS Metrics**: Container and service metrics
- **Application Metrics**: Custom application metrics
- **Performance Monitoring**: Response time tracking
- **Error Tracking**: Error rate and type monitoring

### Application Logging

- **Bunyan Logger**: Structured JSON logging
- **Component Logging**: Per-component loggers
- **Request Logging**: Request/response logging
- **Error Logging**: Comprehensive error tracking

### Health Checks

- **ECS Health**: Container health monitoring
- **Application Health**: Application status monitoring
- **Database Health**: DynamoDB connection monitoring
- **WebSocket Health**: Connection status monitoring

## Security

### Network Security

- **Security Groups**: Network access control
- **Load Balancer Security**: HTTPS termination
- **VPC Configuration**: Private network isolation
- **CORS Configuration**: Cross-origin request handling

### Application Security

- **Input Validation**: Request parameter validation
- **Error Handling**: Secure error responses
- **Connection Security**: WebSocket connection validation
- **Data Validation**: Entity data validation

### Container Security

- **Non-root User**: Container runs as non-root user
- **Image Scanning**: Container image security scanning
- **Secrets Management**: Environment variable security
- **Network Isolation**: Container network isolation

## Future Improvements

### Data Pipeline & Streaming

- **Real Streaming Integration**: Replace mock data with actual AWS Kinesis, Apache Kafka, or Apache Pulsar
- **Data Ingestion**: Real-time data ingestion from multiple sources (logs, metrics, alerts)
- **Stream Processing**: Apache Flink or AWS Kinesis Data Analytics for real-time processing
- **Data Quality**: Schema validation, data cleansing, and anomaly detection

### Aggregation & Storage

- **Pre-computed Aggregations**: Store aggregated metrics in DynamoDB instead of runtime calculation
- **Time-series Database**: InfluxDB or TimescaleDB for historical data
- **Data Warehousing**: Amazon Redshift or Snowflake for analytics
- **Caching Strategy**: Redis for high-frequency data, multi-layer caching

### Scalability & Performance

- **Horizontal Scaling**: Auto-scaling ECS services based on load
- **Load Balancing**: Application Load Balancer with WebSocket support
- **Database Sharding**: Partition data across multiple DynamoDB tables
- **CDN Integration**: CloudFront for global content delivery
- **Connection Pooling**: Efficient WebSocket connection management

### Security & Compliance

- **Authentication**: JWT tokens, OAuth2, or AWS Cognito
- **Authorization**: Role-based access control (RBAC)
- **Data Encryption**: At-rest and in-transit encryption
- **Audit Logging**: Comprehensive audit trails
- **Compliance**: SOC2, GDPR, HIPAA compliance features

### Monitoring & Observability

- **Distributed Tracing**: AWS X-Ray or Jaeger for request tracing
- **Metrics Collection**: Prometheus, CloudWatch, or DataDog
- **Alerting**: Real-time alerts for anomalies and failures
- **Health Checks**: Comprehensive health monitoring
- **Performance Monitoring**: APM tools for performance insights

---

**Built for Wraithwatch Cybersecurity - High-performance real-time data streaming**
