# Wraithwatch Lambda@Edge

A CloudFront edge function built with AWS Lambda@Edge and TypeScript, designed to process requests at the edge for enhanced performance, security, and user experience in the Wraithwatch cybersecurity dashboard.

## 🎯 Overview

The Wraithwatch Lambda@Edge function provides edge computing capabilities for the cybersecurity dashboard, processing requests at CloudFront edge locations worldwide. This enables low-latency request handling, security enhancements, and performance optimizations at the edge of the AWS network.

## ✨ Features

### 🌐 Edge Processing
- **Global Distribution**: Processing at 400+ CloudFront edge locations
- **Low Latency**: Sub-100ms response times worldwide
- **Request Modification**: Dynamic request transformation
- **Response Enhancement**: Real-time response optimization

### 🔒 Security Enhancements
- **Request Validation**: Input sanitization and validation
- **Security Headers**: Automatic security header injection
- **Rate Limiting**: Edge-level rate limiting
- **Bot Protection**: Basic bot detection and mitigation

### ⚡ Performance Optimization
- **Caching Optimization**: Intelligent cache control
- **Compression**: Automatic content compression
- **Redirect Handling**: Smart redirect management
- **Error Handling**: Graceful error responses

### 🔧 Technical Features
- **TypeScript**: Type-safe edge function development
- **Webpack**: Optimized bundle compilation
- **Testing**: Comprehensive edge function testing
- **Monitoring**: CloudWatch edge metrics

## 🛠️ Technology Stack

### Core Platform
- **AWS Lambda@Edge**: Edge computing platform
- **Node.js 22**: Latest LTS runtime
- **TypeScript**: Type-safe development

### CloudFront Integration
- **CloudFront Events**: Viewer request/response handling
- **Edge Locations**: Global edge processing
- **Cache Behavior**: Intelligent caching strategies
- **Origin Control**: Dynamic origin selection

### Development Tools
- **Jest**: Testing framework
- **ESLint**: Code linting
- **Webpack**: Bundle optimization
- **AWS SAM**: Serverless deployment

## 🚀 Quick Start

### Prerequisites
- AWS CLI configured
- CloudFront distribution
- Node.js 22+
- AWS SAM CLI (optional)

### Installation

1. **Install dependencies**
   ```bash
   yarn install
   ```

2. **Set environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your CloudFront configuration
   ```

3. **Build the function**
   ```bash
   yarn build
   ```

4. **Deploy to CloudFront**
   ```bash
   yarn deploy
   ```

## 📁 Project Structure

```
apps/lambda-at-edge/
├── src/
│   ├── __tests__/           # Test files
│   ├── constants/           # Application constants
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── handler.ts           # Lambda function handler
│   └── index.ts             # Application entry point
├── webpack.config.js        # Bundle configuration
├── template.yaml            # AWS SAM template
└── package.json             # Dependencies and scripts
```

## 🔧 CloudFront Events

### Viewer Request Event
```typescript
interface CloudFrontRequest {
  uri: string;
  method: string;
  headers: Record<string, any>;
  querystring: string;
  clientIp: string;
  userAgent: string;
}
```

### Viewer Response Event
```typescript
interface CloudFrontResponse {
  status: string;
  statusDescription: string;
  headers: Record<string, any>;
  body?: string;
}
```

## 🔧 Development

### Available Scripts

```bash
# Development
yarn dev              # Start local development
yarn build            # Build for production
yarn deploy           # Deploy to CloudFront

# Testing
yarn test             # Run unit tests
yarn test:watch       # Run tests in watch mode
yarn test:coverage    # Generate coverage report

# Code Quality
yarn lint             # Run ESLint
yarn lint:fix         # Fix linting issues
yarn type-check       # TypeScript type checking
```

### Environment Variables

```bash
# Required
CLOUDFRONT_DISTRIBUTION_ID=your_distribution_id
AWS_REGION=us-east-1

# Optional
NODE_ENV=production
LOG_LEVEL=info
EDGE_FUNCTION_NAME=wraithwatch-edge
```

### Development Workflow

1. **Set up local development**
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

4. **Deploy to CloudFront**
   ```bash
   yarn deploy
   ```

## 🧪 Testing Strategy

### Unit Testing
- **Jest**: Test runner and assertion library
- **Lambda Testing**: Edge function testing
- **Mocking**: CloudFront event mocking
- **Coverage**: 70%+ threshold enforced

### Integration Testing
- **CloudFront Testing**: Edge function integration testing
- **Event Testing**: CloudFront event handling testing
- **Performance Testing**: Response time testing
- **Error Testing**: Error scenario testing

### Test Structure
```
__tests__/
├── handler.test.ts          # Lambda handler tests
├── utils/                   # Utility function tests
└── constants/               # Constant tests
```

## 🚀 Deployment

### AWS SAM Deployment

1. **Build the application**
   ```bash
   yarn build
   ```

2. **Deploy with SAM**
   ```bash
   sam build
   sam deploy --guided
   ```

### Manual CloudFront Deployment

1. **Create Lambda function**
   ```bash
   aws lambda create-function \
     --function-name wraithwatch-edge \
     --runtime nodejs22.x \
     --handler index.handler \
     --zip-file fileb://function.zip
   ```

2. **Publish function version**
   ```bash
   aws lambda publish-version \
     --function-name wraithwatch-edge
   ```

3. **Associate with CloudFront**
   ```bash
   aws cloudfront update-distribution \
     --id your_distribution_id \
     --default-cache-behavior LambdaFunctionAssociations
   ```

### Environment Configuration

```bash
# Production
NODE_ENV=production
CLOUDFRONT_DISTRIBUTION_ID=your_production_distribution
AWS_REGION=us-east-1
EDGE_FUNCTION_NAME=wraithwatch-edge-prod

# Development
NODE_ENV=development
CLOUDFRONT_DISTRIBUTION_ID=your_development_distribution
AWS_REGION=us-east-1
EDGE_FUNCTION_NAME=wraithwatch-edge-dev
```

## 📊 Performance Optimization

### Edge Function Optimization
- **Bundle Size**: Minimized bundle size for fast loading
- **Memory Configuration**: Optimal memory allocation
- **Timeout Settings**: 5-second timeout (CloudFront limit)
- **Cold Start**: Optimized cold start performance

### CloudFront Optimization
- **Cache Headers**: Intelligent cache control
- **Compression**: Automatic content compression
- **Origin Selection**: Dynamic origin routing
- **Error Handling**: Graceful error responses

### Cost Optimization
- **Function Size**: Minimized function size
- **Execution Time**: Optimized execution time
- **Memory Usage**: Efficient memory utilization
- **Request Filtering**: Selective request processing

## 🔍 Monitoring & Logging

### CloudWatch Monitoring
- **Edge Metrics**: CloudFront edge function metrics
- **Performance Monitoring**: Response time tracking
- **Error Tracking**: Error rate and type monitoring
- **Request Monitoring**: Request volume and patterns

### Application Logging
- **Structured Logging**: JSON-formatted logs
- **Request Logging**: Request/response logging
- **Error Logging**: Comprehensive error tracking
- **Performance Logging**: Response time monitoring

### Health Checks
- **Function Health**: Edge function status monitoring
- **CloudFront Health**: Distribution health monitoring
- **Performance Health**: Response time monitoring
- **Error Health**: Error rate monitoring

## 🔒 Security

### Request Security
- **Input Validation**: Request parameter validation
- **Security Headers**: Automatic security header injection
- **Rate Limiting**: Edge-level rate limiting
- **Bot Protection**: Basic bot detection

### Response Security
- **Content Security**: Response content validation
- **Header Security**: Security header injection
- **CORS Handling**: Cross-origin request handling
- **Error Security**: Secure error responses

### Edge Security
- **Request Filtering**: Malicious request filtering
- **Origin Validation**: Origin request validation
- **IP Filtering**: IP-based request filtering
- **User Agent Validation**: User agent validation

## 🤝 Contributing

### Development Guidelines
1. **TypeScript**: Strict type checking required
2. **Testing**: Unit tests for new features
3. **Linting**: ESLint rules must pass
4. **Documentation**: Function documentation updates
5. **Performance**: Performance impact assessment

### Code Review Process
1. **Feature Branch**: Create from main
2. **Tests**: Ensure all tests pass
3. **Linting**: Fix any linting issues
4. **Performance**: Check performance impact
5. **Review**: Submit pull request

## 📚 Function Documentation

### CloudFront Events
- **Viewer Request**: Request processing at edge
- **Viewer Response**: Response processing at edge
- **Origin Request**: Origin request processing
- **Origin Response**: Origin response processing

### Request Processing
- **Request Validation**: Input validation and sanitization
- **Request Modification**: Dynamic request transformation
- **Origin Selection**: Dynamic origin routing
- **Error Handling**: Graceful error responses

### Response Processing
- **Response Enhancement**: Response optimization
- **Header Injection**: Security and performance headers
- **Content Modification**: Dynamic content modification
- **Cache Control**: Intelligent cache control

---

**Built for Wraithwatch Cybersecurity - High-performance edge computing**
