# Wraithwatch Realtime API

A high-performance WebSocket and REST API built with Fastify and TypeScript, designed to serve real-time cybersecurity threat data with intelligent caching and data streaming capabilities.

## 🎯 Overview

The Wraithwatch Realtime API provides the backbone for the cybersecurity dashboard, delivering real-time entity updates, historical data, and aggregated metrics through WebSocket connections and REST endpoints. Built for scale and performance, it demonstrates effective patterns for handling high-frequency data streams.

## ✨ Features

### 🔌 Real-time Communication
- **WebSocket Server**: Real-time bidirectional communication
- **Connection Management**: Automatic reconnection and heartbeat
- **Event Broadcasting**: Efficient multi-client message distribution
- **Connection Pooling**: Optimized for concurrent connections

### 📊 Data Management
- **Entity Management**: CRUD operations for cybersecurity entities
- **Time-series Data**: Historical change tracking and analysis
- **Property Evolution**: Dynamic property change monitoring
- **Data Aggregation**: Real-time metrics calculation

### 🗄️ Database Integration
- **DynamoDB Integration**: NoSQL database for entity storage
- **Time-based Partitioning**: Efficient data retrieval patterns
- **Batch Operations**: Optimized bulk data processing
- **Query Optimization**: GSI and LSI for performance

### 🚀 Performance Features
- **Intelligent Caching**: 3-hour TTL with memory optimization
- **Connection Pooling**: Efficient resource management
- **Data Compression**: Optimized payload sizes
- **Rate Limiting**: Protection against abuse

## 🛠️ Technology Stack

### Core Framework
- **Fastify**: High-performance web framework
- **TypeScript**: Type-safe development
- **Node.js 22**: Latest LTS runtime

### Database & Storage
- **DynamoDB**: NoSQL database for entity storage
- **Node-cache**: In-memory caching layer
- **Time-series Data**: Historical change tracking

### Real-time Communication
- **WebSocket**: Real-time bidirectional communication
- **Socket.io**: Enhanced WebSocket features
- **Connection Management**: Automatic reconnection

### Development Tools
- **Jest**: Testing framework
- **ESLint**: Code linting
- **Webpack**: Bundle optimization
- **Docker**: Containerization

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- AWS CLI configured
- DynamoDB table created
- Docker (for containerized deployment)

### Installation

1. **Install dependencies**
   ```bash
   yarn install
   ```

2. **Set environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your AWS and database configuration
   ```

3. **Start development server**
   ```bash
   yarn dev
   ```

4. **Verify API endpoints**
   ```bash
   curl http://localhost:3001/health
   ```

## 📁 Project Structure

```
apps/realtime-api/
├── src/
│   ├── __tests__/           # Test files
│   ├── constants/           # Application constants
│   ├── plugins/             # Fastify plugins
│   ├── routes/              # API route handlers
│   ├── services/            # Business logic services
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── index.ts             # Application entry point
│   └── server.ts            # Server configuration
├── mocks/                   # Test mocks
├── Dockerfile               # Container configuration
├── webpack.config.js        # Bundle configuration
└── package.json             # Dependencies and scripts
```

## 🔧 API Endpoints

### REST Endpoints

#### Health Check
```http
GET /health
```
Returns server health status and uptime information.

#### Data Endpoints
```http
GET /api/test/data?limit=100
```
Retrieves entity data with optional pagination.

**Query Parameters:**
- `limit`: Number of entities to return (default: 5)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "positions": [...],
  "metrics": {...},
  "count": 100,
  "positionCount": 50
}
```

### WebSocket Events

#### Connection Events
```javascript
// Client connects
socket.on('connect', () => {
  console.log('Connected to Wraithwatch API');
});

// Server sends connection status
socket.on('connection_status', (data) => {
  console.log('Status:', data.status);
});
```

#### Data Events
```javascript
// Entity updates
socket.on('entity_update', (data) => {
  console.log('Entity updated:', data.entity);
});

// Entity list
socket.on('entity_list', (data) => {
  console.log('Entities:', data.entities);
});

// Metrics updates
socket.on('metrics_update', (data) => {
  console.log('Metrics:', data.metrics);
});
```

## 🗄️ Database Schema

### Entity Changes Table
```typescript
interface EntityChange {
  PK: string;           // Entity ID
  SK: string;           // Timestamp#version
  entity_id: string;    // Entity identifier
  entity_type: string;  // System, Threat, AI_Agent, Network_Node
  timestamp: string;    // ISO timestamp
  properties: object;   // Entity properties
  changes: object[];    // Property changes
  TTL: number;         // Expiration timestamp
}
```

### Entity Positions Table
```typescript
interface EntityPosition {
  PK: string;           // ENTITY_POSITION#entity_id
  SK: string;           // Position type
  entity_id: string;    // Entity identifier
  position: object;     // 3D coordinates
  matrix_position: object; // Matrix-specific positioning
  network_position: object; // Network-specific positioning
  TTL: number;         // Expiration timestamp
}
```

## 🔧 Development

### Available Scripts

```bash
# Development
yarn dev              # Start development server
yarn build            # Build for production
yarn start            # Start production server

# Testing
yarn test             # Run unit tests
yarn test:watch       # Run tests in watch mode
yarn test:coverage    # Generate coverage report

# Code Quality
yarn lint             # Run ESLint
yarn lint:fix         # Fix linting issues
yarn type-check       # TypeScript type checking

# Database
yarn db:clean         # Clean database (requires confirmation)
yarn generate:data    # Generate demo data
```

### Environment Variables

```bash
# Required
DYNAMODB_TABLE_NAME=wraithwatch-entities
AWS_REGION=us-east-1
PORT=3001

# Optional
NODE_ENV=development
LOG_LEVEL=info
CACHE_TTL=10800  # 3 hours in seconds
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
   yarn type-check
   ```

4. **Build for production**
   ```bash
   yarn build
   ```

## 🧪 Testing Strategy

### Unit Testing
- **Jest**: Test runner and assertion library
- **Fastify Testing**: API endpoint testing
- **Mocking**: DynamoDB and WebSocket mocking
- **Coverage**: 70%+ threshold enforced

### Integration Testing
- **WebSocket Testing**: Real-time communication testing
- **Database Testing**: DynamoDB integration testing
- **Performance Testing**: Load and stress testing
- **Error Handling**: Error scenario testing

### Test Structure
```
__tests__/
├── server.test.ts           # Server configuration tests
├── routes/                  # Route handler tests
├── services/                # Service layer tests
└── utils/                   # Utility function tests
```

## 🚀 Deployment

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t wraithwatch-api .
   ```

2. **Run container**
   ```bash
   docker run -p 3001:3001 \
     -e DYNAMODB_TABLE_NAME=wraithwatch-entities \
     -e AWS_REGION=us-east-1 \
     wraithwatch-api
   ```

### AWS ECS Deployment

1. **Build and push to ECR**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com
   docker build -t wraithwatch-api .
   docker tag wraithwatch-api:latest $AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/wraithwatch-api:latest
   docker push $AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/wraithwatch-api:latest
   ```

2. **Deploy to ECS**
   ```bash
   aws ecs update-service --cluster wraithwatch-cluster --service wraithwatch-api --force-new-deployment
   ```

### Environment Configuration

```bash
# Production
NODE_ENV=production
PORT=3001
DYNAMODB_TABLE_NAME=wraithwatch-entities-prod
AWS_REGION=us-east-1
CACHE_TTL=10800

# Development
NODE_ENV=development
PORT=3001
DYNAMODB_TABLE_NAME=wraithwatch-entities-dev
AWS_REGION=us-east-1
CACHE_TTL=3600
```

## 📊 Performance Optimization

### Caching Strategy
- **Node-cache**: In-memory caching with TTL
- **Cache Keys**: Optimized for entity data and positions
- **Memory Management**: 3-hour TTL to prevent memory buildup
- **Cache Invalidation**: Automatic expiration and manual clearing

### Database Optimization
- **GSI Usage**: Efficient query patterns
- **Batch Operations**: Bulk data processing
- **Time-based Partitioning**: Optimized data retrieval
- **Connection Pooling**: Efficient resource usage

### WebSocket Optimization
- **Connection Pooling**: Efficient client management
- **Event Broadcasting**: Optimized multi-client messaging
- **Heartbeat Management**: Connection health monitoring
- **Rate Limiting**: Protection against abuse

## 🔍 Monitoring & Logging

### Application Logging
- **Bunyan Logger**: Structured JSON logging
- **Log Levels**: Error, warn, info, debug
- **Performance Logging**: Request timing and metrics
- **Error Tracking**: Comprehensive error reporting

### Performance Monitoring
- **Request Metrics**: Response times and throughput
- **Memory Usage**: Cache and application memory
- **Database Performance**: Query times and connection usage
- **WebSocket Metrics**: Connection counts and message rates

### Health Checks
- **Database Connectivity**: DynamoDB connection status
- **Cache Health**: Memory usage and hit rates
- **WebSocket Status**: Active connection monitoring
- **System Resources**: CPU and memory utilization

## 🔒 Security

### Authentication & Authorization
- **CORS Configuration**: Cross-origin request handling
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Request parameter sanitization
- **Error Handling**: Secure error responses

### Data Protection
- **Data Encryption**: AWS KMS integration
- **Secure Headers**: Security header implementation
- **Input Sanitization**: XSS and injection protection
- **Audit Logging**: Security event tracking

## 🤝 Contributing

### Development Guidelines
1. **TypeScript**: Strict type checking required
2. **Testing**: Unit tests for new features
3. **Linting**: ESLint rules must pass
4. **Documentation**: API documentation updates
5. **Performance**: Performance impact assessment

### Code Review Process
1. **Feature Branch**: Create from main
2. **Tests**: Ensure all tests pass
3. **Linting**: Fix any linting issues
4. **Performance**: Check performance impact
5. **Review**: Submit pull request

## 📚 API Documentation

### WebSocket Events
- **Connection Events**: Connection status and management
- **Data Events**: Entity updates and metrics
- **Error Events**: Error handling and recovery
- **Custom Events**: Application-specific events

### REST Endpoints
- **Health Endpoints**: System health and status
- **Data Endpoints**: Entity data retrieval
- **Metrics Endpoints**: Aggregated metrics
- **Utility Endpoints**: System utilities

### Error Handling
- **HTTP Status Codes**: Standard REST status codes
- **Error Responses**: Structured error messages
- **Validation Errors**: Input validation feedback
- **System Errors**: Internal error handling

---

**Built for Wraithwatch Cybersecurity - High-performance real-time data streaming** 