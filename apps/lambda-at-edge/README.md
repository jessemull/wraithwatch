# Wraithwatch Lambda@Edge

A CloudFront edge function built with AWS Lambda@Edge and TypeScript, designed to handle domain redirects and URL normalization for the Wraithwatch cybersecurity dashboard.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Deployment](#deployment)
- [Performance Optimization](#performance-optimization)
- [Monitoring & Logging](#monitoring--logging)
- [Security](#security)

## Overview

The Wraithwatch Lambda@Edge function provides edge computing capabilities for the cybersecurity dashboard, processing requests at CloudFront edge locations worldwide. This enables low-latency request handling, domain redirects, and URL normalization at the edge of the AWS network.

## Features

### Domain Management
- **Domain Redirect**: Redirects `wraithwatch-demo.com` to `www.wraithwatch-demo.com`
- **URL Normalization**: Adds `.html` extension to URLs without file extensions
- **Query String Preservation**: Maintains query parameters during redirects
- **Protocol Preservation**: Respects the original protocol (HTTP/HTTPS)

### Request Processing
- **Edge Processing**: Processing at 400+ CloudFront edge locations
- **Low Latency**: Sub-100ms response times worldwide
- **Request Modification**: Dynamic request transformation
- **Response Enhancement**: Real-time response optimization

### Technical Features
- **TypeScript**: Type-safe edge function development
- **Webpack**: Optimized bundle compilation
- **Testing**: Comprehensive edge function testing
- **Monitoring**: CloudWatch edge metrics

## Technology Stack

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
- **GitHub Actions**: Deployment workflows

## Quick Start

### Prerequisites
- AWS CLI configured
- CloudFront distribution
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

3. **Build the function**
   ```bash
   yarn build
   ```

4. **Test the function**
   ```bash
   # Test domain redirect
   curl -I https://wraithwatch-demo.com
   # Should redirect to https://www.wraithwatch-demo.com
   ```

## Project Structure

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

## API Endpoints

### CloudFront Events

The Lambda@Edge function processes CloudFront viewer request events:

```typescript
interface CloudFrontRequestEvent {
  Records: [{
    cf: {
      request: {
        uri: string;
        method: string;
        headers: Record<string, any>;
        querystring: string;
        clientIp: string;
        userAgent: string;
      };
    };
  }];
}
```

### Request Processing

The function handles two main scenarios:

1. **Domain Redirect**: Redirects non-canonical domain to canonical domain
2. **URL Normalization**: Adds `.html` extension to URLs without file extensions

### Response Types

- **Redirect Response**: 301 redirect for domain changes
- **Modified Request**: Updated URI for URL normalization
- **Pass-through**: Unmodified request for standard paths

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
yarn format           # Format code with Prettier
yarn format:check     # Check code formatting
```

### Environment Variables

```bash
# Required
AWS_REGION=us-east-1

# Optional
NODE_ENV=production
LOG_LEVEL=info
EDGE_FUNCTION_NAME=wraithwatch-edge
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

The Lambda@Edge function is deployed via GitHub Actions workflow and AWS CloudFormation:

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
   - Associate with CloudFront distribution
   - Set environment variables

### Deployment Steps

1. **Trigger Deployment**
   ```bash
   # Go to GitHub Actions and trigger "Deploy Lambda at Edge" workflow
   ```

2. **Monitor Deployment**
   - Watch CloudFormation stack updates
   - Check Lambda function version creation
   - Verify CloudFront association

3. **Verify Deployment**
   ```bash
   # Test domain redirect
   curl -I https://wraithwatch-demo.com
   
   # Test URL normalization
   curl -I https://www.wraithwatch-demo.com/about
   ```

## Infrastructure Components

- **Lambda Function**: `wraithwatch-lambda-at-edge` with 5-second timeout
- **CloudFront**: Global CDN with edge function association
- **S3 Bucket**: `wraithwatch-lambda-at-edge` for deployment artifacts
- **CloudFormation**: Stack management and versioning
- **IAM Roles**: Execution permissions for Lambda@Edge

## Performance Optimization

### Edge Function Optimization
- **Bundle Size**: Minimized bundle size for fast loading
- **Memory Configuration**: Optimal memory allocation (128MB)
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

## Monitoring & Logging

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

## Security

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

---

**Built for Wraithwatch Cybersecurity - High-performance edge computing**
