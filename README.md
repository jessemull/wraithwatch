# Wraithwatch Cybersecurity Dashboard

A real-time cybersecurity threat monitoring dashboard built for demonstrating advanced data visualization and streaming analytics capabilities. This project showcases a comprehensive full-stack application with real-time data streaming, 3D visualizations, and AI-powered threat detection.

## 🎯 Project Overview

Wraithwatch is a prototype cybersecurity dashboard designed to demonstrate how AI unlocks access to more data and visualization capabilities than ever before. The system provides intuitive ways to understand how entities and their properties change over time, helping security analysts navigate infinite dataspace toward useful outcomes.

### Key Features

- **Real-time Data Streaming**: Live threat data via WebSocket connections
- **3D Visualizations**: Interactive Matrix, Network, and Timeline views
- **AI-Powered Analytics**: Threat scoring and confidence metrics
- **Responsive Dashboard**: Real-time metrics and KPI tracking
- **ChatBot Integration**: AI assistant for threat analysis
- **Multi-Entity Support**: Systems, Threats, AI Agents, Network Nodes

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Realtime API   │    │   DynamoDB      │
│   (Next.js)     │◄──►│   (Fastify)     │◄──►│   (Database)    │
│                 │    │                 │    │                 │
│ • 3D Viz        │    │ • WebSocket     │    │ • Entity Data   │
│ • Dashboard     │    │ • REST API      │    │ • Time Series   │
│ • ChatBot       │    │ • Caching       │    │ • Positions     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CloudFront    │    │   ECS/Fargate   │    │   Lambda@Edge   │
│   (CDN)         │    │   (Container)   │    │   (Edge)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- Yarn package manager
- AWS CLI configured
- Docker (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jessemull/wraithwatch.git
   cd wraithwatch
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   # Start all services
   yarn dev
   
   # Or start individually
   yarn workspace @wraithwatch/frontend dev
   yarn workspace @wraithwatch/realtime-api dev
   yarn workspace @wraithwatch/chat-bot dev
   ```

## 📁 Project Structure

```
wraithwatch/
├── apps/
│   ├── frontend/                 # Next.js dashboard application
│   ├── realtime-api/            # Fastify WebSocket API
│   ├── chat-bot/                # AWS Lambda chatbot
│   └── lambda-at-edge/          # CloudFront edge functions
├── infrastructure/               # AWS CloudFormation templates
├── scripts/                     # Data generation utilities
└── package.json                 # Root workspace configuration
```

## 🛠️ Applications

### Frontend Dashboard (`apps/frontend/`)
- **Framework**: Next.js 14 with TypeScript
- **Visualization**: Three.js 3D graphics
- **Styling**: Tailwind CSS
- **State Management**: React hooks
- **Testing**: Jest + Cypress

### Realtime API (`apps/realtime-api/`)
- **Framework**: Fastify with TypeScript
- **WebSocket**: Real-time data streaming
- **Database**: DynamoDB integration
- **Caching**: Node-cache with 3-hour TTL
- **Deployment**: Docker + ECS Fargate

### ChatBot (`apps/chat-bot/`)
- **Platform**: AWS Lambda
- **AI**: Claude 3.5 Sonnet integration
- **Framework**: Node.js with TypeScript
- **Features**: Threat analysis, entity queries

### Lambda@Edge (`apps/lambda-at-edge/`)
- **Platform**: AWS Lambda@Edge
- **Purpose**: CloudFront request processing
- **Timeout**: 5 seconds (CloudFront limit)

## 🎨 Features

### Dashboard Components
- **Real-time Metrics**: Active threats, threat scores, AI confidence
- **3D Visualizations**: 
  - Matrix View: Threat positioning by severity
  - Network View: Entity connections and data flow
  - Timeline View: Historical changes over time
- **Entity Management**: System, Threat, AI Agent, Network Node entities
- **ChatBot Integration**: AI-powered threat analysis

### Data Streaming
- **WebSocket Connections**: Real-time entity updates
- **Mock Data Generation**: Realistic cybersecurity scenarios
- **Time-series Data**: Historical change tracking
- **Property Evolution**: Dynamic entity property changes

### Performance Optimizations
- **Caching Strategy**: 3-hour TTL for optimal memory usage
- **CDN Integration**: CloudFront for global distribution
- **Lighthouse CI**: Performance monitoring (target: 80+ score)
- **Bundle Optimization**: Webpack tree-shaking

## 🚀 Deployment

### Production Deployment
```bash
# Deploy infrastructure
yarn deploy:infrastructure

# Deploy applications
yarn deploy:frontend
yarn deploy:api
yarn deploy:chatbot
```

### Environment Variables
```bash
# Frontend
NEXT_PUBLIC_API_URL=https://api.wraithwatch-demo.com
NEXT_PUBLIC_WEBSOCKET_URL=wss://api.wraithwatch-demo.com

# API
DYNAMODB_TABLE_NAME=wraithwatch-entities
AWS_REGION=us-east-1

# ChatBot
CLAUDE_API_KEY=your_claude_api_key
```

## 🧪 Testing

```bash
# Run all tests
yarn test

# Frontend tests
yarn workspace @wraithwatch/frontend test

# API tests
yarn workspace @wraithwatch/realtime-api test

# E2E tests
yarn workspace @wraithwatch/frontend cypress:run
```

## 📊 Performance

- **Lighthouse Score**: Target 80+ (currently optimized for CI)
- **WebSocket Latency**: <100ms for real-time updates
- **Cache Hit Rate**: 95%+ with 3-hour TTL
- **Bundle Size**: <500KB gzipped

## 🔧 Development

### Code Quality
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier auto-formatting
- **Type Safety**: Strict TypeScript configuration
- **Testing**: 70%+ coverage threshold

### Development Workflow
```bash
# Lint and format
yarn lint

# Type checking
yarn type-check

# Build all applications
yarn build

# Start development servers
yarn dev
```

## 🏛️ Infrastructure

### AWS Services
- **ECS Fargate**: Containerized API deployment
- **DynamoDB**: NoSQL database for entity storage
- **CloudFront**: Global CDN with edge functions
- **Lambda**: Serverless chatbot and edge processing
- **S3**: Static frontend hosting
- **API Gateway**: REST API management

### Monitoring
- **CloudWatch**: Application and infrastructure metrics
- **Lighthouse CI**: Performance monitoring
- **GitHub Actions**: Automated testing and deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js**: 3D visualization library
- **Fastify**: High-performance web framework
- **Next.js**: React framework for production
- **AWS**: Cloud infrastructure and services
- **Claude AI**: Advanced language model integration

---

**Built for Wraithwatch Cybersecurity - Demonstrating the future of threat intelligence visualization** 