# Wraithwatch ChatBot

An AI-powered cybersecurity assistant built with AWS Lambda and Claude 3.5 Sonnet, designed to provide intelligent threat analysis, entity queries, and security insights for the Wraithwatch dashboard.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Testing Strategy](#testing-strategy)
- [Deployment](#deployment)
- [Performance Optimization](#performance-optimization)
- [Monitoring & Logging](#monitoring--logging)
- [Security](#security)
- [Future Improvements](#future-improvements)

## Overview

The Wraithwatch ChatBot provides an intelligent interface for security analysts to interact with cybersecurity data through natural language. Built on AWS Lambda for scalability and Claude AI for advanced reasoning, it demonstrates effective AI integration patterns for security operations.

## Features

### Basic Chat Functionality

- **Natural Language Processing**: Handle incoming chat messages
- **Claude Integration**: Connect to Claude 3.5 Sonnet API
- **Response Generation**: Generate AI-powered responses
- **Error Handling**: Graceful error management

### Conversation Management

- **Session Persistence**: Maintains conversation context
- **History Tracking**: Conversation history and analysis
- **Multi-turn Dialogues**: Complex multi-step conversations
- **Context Switching**: Seamless topic transitions

### Technical Features

- **AWS Lambda**: Serverless architecture
- **CORS Support**: Cross-origin request handling
- **Error Handling**: Robust error management
- **Logging**: Comprehensive request logging

## Technology Stack

### Core Platform

- **AWS Lambda**: Serverless compute platform
- **Node.js 22**: Latest LTS runtime
- **TypeScript**: Type-safe development

### AI Integration

- **Claude 3.5 Sonnet**: Anthropic's advanced language model
- **Anthropic SDK**: Official Claude API client
- **Prompt Engineering**: Optimized security prompts

### Development Tools

- **Jest**: Testing framework
- **ESLint**: Code linting

### CI/CD

- **Webpack**: Bundle optimization
- **Github Actions**: Deployment workflows
- **Cloudformation**: AWS infrastructure

## Quick Start

### Prerequisites

- AWS CLI configured
- Claude API key
- Node.js 22+

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

3. **Build the application**

   ```bash
   yarn build
   ```

4. **Test the chatbot**
   ```bash
   curl -X POST https://api.chat.wraithwatch-demo.com/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "What threats are currently active?"}'
   ```

## Project Structure

```
apps/chat-bot/
├── src/
│   ├── constants/           # Application constants
│   ├── services/            # Business logic services
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── handler.ts           # Lambda function handler
│   └── index.ts             # Application entry point
├── __tests__/               # Test files
├── webpack.config.js        # Bundle configuration
└── package.json             # Dependencies and scripts
```

## API Endpoints

### Chat Endpoint

```http
POST https://api.chat.wraithwatch-demo.com/api/chat
```

**Request Body:**

```json
{
  "message": "What threats are currently active?",
  "sessionId": "user-session-123",
  "context": {
    "entityId": "threat-001",
    "entityType": "Threat"
  }
}
```

**Response:**

```json
{
  "success": true,
  "response": "I found 3 active threats in your system...",
  "sessionId": "user-session-123",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

### Health Check

```http
GET https://api.chat.wraithwatch-demo.com/api/health
```

**Response:**

```json
{
  "message": "Wraithwatch Chat Bot is running! Send a POST request with a message to start chatting.",
  "history": [],
  "timestamp": "2024-01-01T10:00:00Z",
  "requestId": "request-123"
}
```

## Development

### Available Scripts

```bash
# Development
yarn build            # Build for production
yarn clean            # Clean build directory
yarn package          # Package for deployment

# Testing
yarn test             # Run unit tests
yarn test:watch       # Run tests in watch mode

# Code Quality
yarn lint             # Run ESLint
yarn lint:fix         # Fix linting issues
```

### Environment Variables

```bash
# Required
CLAUDE_API_KEY=your_claude_api_key
AWS_REGION=us-east-1

# Optional
NODE_ENV=production
LOG_LEVEL=info
MAX_TOKENS=4000
TEMPERATURE=0.7
```

### Development Workflow

1. **Run tests**

   ```bash
   yarn test
   ```

2. **Check code quality**

   ```bash
   yarn lint:fix
   ```

3. **Build for production**
   ```bash
   yarn build
   ```

## Deployment

### GitHub Actions Deployment

The chatbot is deployed via GitHub Actions workflow and AWS CloudFormation:

1. **Manual Trigger**: Deploy via GitHub Actions workflow dispatch
2. **Build Process**:
   - Install dependencies
   - Lint code
   - Run unit tests
   - Build Lambda package
   - Upload to S3

3. **CloudFormation Deployment**:
   - Create/update CloudFormation stack
   - Deploy Lambda function with new version
   - Configure API Gateway integration
   - Set environment variables

## Infrastructure Components

- **Lambda Function**: `wraithwatch-chat-bot` with 30-second timeout
- **API Gateway**: REST API with CORS support
- **S3 Bucket**: `wraithwatch-chat-bot` for deployment artifacts
- **CloudFormation**: Stack management and versioning
- **IAM Roles**: Execution permissions for Lambda

## Performance Optimization

### Lambda Optimization

- **Cold Start Reduction**: Optimized bundle size
- **Memory Configuration**: Appropriate memory allocation
- **Timeout Settings**: Optimal timeout configuration
- **Concurrency**: Request concurrency management

### AI Response Optimization

- **Prompt Engineering**: Optimized prompt design
- **Token Management**: Efficient token usage
- **Response Caching**: Cached common responses
- **Streaming**: Real-time response streaming

### Cost Optimization

- **Request Batching**: Batch multiple requests
- **Response Caching**: Cache frequent responses
- **Token Usage**: Optimize token consumption
- **Lambda Configuration**: Right-size Lambda functions

## Monitoring & Logging

### Application Logging

- **Structured Logging**: JSON-formatted logs
- **Request Tracking**: Request/response logging
- **Error Logging**: Comprehensive error tracking
- **Performance Logging**: Response time monitoring

### AWS Monitoring

- **CloudWatch**: Application and infrastructure metrics
- **Lambda Metrics**: Function performance monitoring
- **API Gateway**: Endpoint performance tracking
- **Error Tracking**: Error rate and type monitoring

### AI Performance

- **Response Time**: Claude API response times
- **Token Usage**: Token consumption tracking
- **Success Rate**: Request success monitoring
- **Quality Metrics**: Response quality assessment

## Security

### API Security

- **CORS Configuration**: Cross-origin request handling
- **Input Validation**: Request parameter sanitization
- **Rate Limiting**: Protection against abuse
- **Error Handling**: Secure error responses

### AI Security

- **Prompt Injection Protection**: Input sanitization
- **Token Limits**: Request size limitations
- **Content Filtering**: Inappropriate content filtering
- **Audit Logging**: Security event tracking

### Data Protection

- **Encryption**: Data encryption in transit and at rest
- **Access Control**: AWS IAM role management
- **Secret Management**: AWS Secrets Manager integration
- **Compliance**: Security compliance validation

## Future Improvements

### Threat Intelligence Integration

- **Entity Data Access**: Connect to DynamoDB to retrieve real entity information
- **Threat Analysis**: Implement context-aware threat assessment using entity data
- **Risk Scoring**: Develop automated risk calculation algorithms
- **Recommendations**: Generate actionable security insights based on threat data

### Implementation Approach

1. **Database Integration**: Add DynamoDB client to access entity data
2. **Context Enhancement**: Pass entity context to Claude for more informed responses
3. **Prompt Engineering**: Develop specialized prompts for cybersecurity analysis
4. **Response Processing**: Parse and structure Claude responses for dashboard display

### Technical Implementation

```typescript
// Example: Enhanced handler with entity context

interface ChatRequest {
  message: string;
  sessionId: string;
  context?: {
    entityId?: string;
    entityType?: string;
    threatData?: any;
  };
}

// Enhanced Claude prompt with entity context

const buildPrompt = (message: string, entityContext?: any) => {
  const basePrompt = 'You are a cybersecurity analyst assistant...';
  const entityInfo = entityContext
    ? `\nEntity Context: ${JSON.stringify(entityContext)}`
    : '';
  return `${basePrompt}${entityInfo}\n\nUser: ${message}`;
};
```

---

**Built for Wraithwatch Cybersecurity - Intelligent AI-powered threat analysis**
