# Wraithwatch Cybersecurity Dashboard

A comprehensive full-stack cybersecurity monitoring platform built in just a few days, demonstrating advanced real-time data visualization, AI-powered threat analysis, and modern cloud architecture. This project showcases the ability to rapidly build production-ready applications while balancing full-time work and family obligations.

## Project Overview

Wraithwatch is a real-time cybersecurity dashboard that demonstrates how modern web technologies can unlock powerful data visualization and AI capabilities. Built as a proof-of-concept for rapid development in a startup environment, it showcases:

- **Real-time Data Streaming** with WebSocket connections
- **Interactive 3D Visualizations** using Three.js
- **AI-Powered ChatBot** for threat analysis
- **Cloud-Native Architecture** with AWS services
- **Modern Development Practices** with TypeScript and testing

### Key Achievements

- ✅ **Built in 3 days** while working full-time and managing family
- ✅ **Full-stack application** with 4 distinct services
- ✅ **Production deployment** on AWS with CI/CD
- ✅ **Real-time features** with WebSocket streaming
- ✅ **AI integration** with Claude 3.5 Sonnet
- ✅ **3D visualizations** for complex data representation
- ✅ **Comprehensive testing** with 70%+ coverage
- ✅ **Modern architecture** with microservices and edge computing

## System Architecture

```
┌─────────────────────────────────────────────────────────────────-┐
│                        Wraithwatch Platform                      │
├────────────────────────────────────────────────────────────────-─┤
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────-┐  │
│  │   Frontend      │    │  Realtime API   │    │   DynamoDB   │  │
│  │   (Next.js)     │◄──►│   (Fastify)     │◄──►│   (Database) │  │
│  │                 │    │                 │    │              │  │
│  │ • 3D Viz        │    │ • WebSocket     │    │ • Entities   │  │
│  │ • Dashboard     │    │ • REST API      │    │ • Time Series│  │
│  │ • ChatBot UI    │    │ • Caching       │    │ • Positions  │  │
│  └─────────────────┘    └─────────────────┘    └─────────────-┘  │
│           │                       │                              │
│           │                       │                              │
│           ▼                       ▼                              │
│  ┌─────────────────┐    ┌─────────────────┐                      │
│  │   CloudFront    │    │   ECS/Fargate   │                      │
│  │   (CDN)         │    │   (Container)   │                      │
│  └─────────────────┘    └─────────────────┘                      │
│           │                       │                              │
│           │                       │                              │
│           ▼                       ▼                              │
│  ┌─────────────────┐    ┌─────────────────┐                      │
│  │   Lambda@Edge   │    │   API Gateway   │                      │
│  │   (Redirects)   │    │   (REST)        │                      │
│  └─────────────────┘    └─────────────────┘                      │
│           │                       │                              │
│           │                       │                              │
│           ▼                       ▼                              │
│  ┌─────────────────┐    ┌─────────────────┐                      │
│  │  S3             │    │   ChatBot       │                      │
│  │  (Static Files) │    │   (Lambda)      │                      │
│  └─────────────────┘    └─────────────────┘                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────-┘
```

## Applications

### 1. Frontend Dashboard (`apps/frontend/`)

**Next.js 15 + TypeScript + Three.js**

A modern React dashboard with real-time 3D visualizations:

- **Real-time Entity Updates** via WebSocket
- **3D Visualizations**: Matrix, Network, and Timeline views
- **Interactive Charts** with Chart.js
- **Responsive Design** with Tailwind CSS
- **Performance Optimized** with Lighthouse CI

**Key Skills Demonstrated:**

- Modern React patterns with hooks and context
- 3D graphics programming with Three.js
- Real-time data visualization
- Performance optimization and testing
- Responsive design and accessibility

### 2. Realtime API (`apps/realtime-api/`)

**Fastify + WebSocket + DynamoDB**

High-performance WebSocket server for real-time data streaming:

- **WebSocket Server** with connection management
- **DynamoDB Integration** for entity storage
- **REST API** for historical data
- **Caching Strategy** with 3-hour TTL
- **Docker Deployment** on ECS Fargate

**Key Skills Demonstrated:**

- WebSocket programming and connection management
- NoSQL database design with DynamoDB
- High-performance server development
- Containerization and cloud deployment
- Real-time data streaming patterns

### 3. ChatBot (`apps/chat-bot/`)

**AWS Lambda + Claude 3.5 Sonnet**

AI-powered cybersecurity assistant:

- **Claude AI Integration** for natural language processing
- **Session Management** for conversation context
- **Threat Analysis** capabilities
- **Serverless Architecture** with Lambda
- **API Gateway** integration

**Key Skills Demonstrated:**

- AI/ML integration with language models
- Serverless architecture patterns
- Natural language processing
- API design and integration
- AWS Lambda development

### 4. Lambda@Edge (`apps/lambda-at-edge/`)

**CloudFront Edge Functions**

Edge computing for performance optimization:

- **Domain Redirects** and URL normalization
- **Edge Processing** at 400+ locations worldwide
- **Request Transformation** and caching
- **Global CDN** optimization

**Key Skills Demonstrated:**

- Edge computing and CDN optimization
- Request/response transformation
- Global performance optimization
- CloudFront and Lambda@Edge

## Technology Stack

### Frontend

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Three.js**: 3D graphics and visualization
- **Tailwind CSS**: Utility-first styling
- **Chart.js**: Data visualization
- **Jest + Cypress**: Testing framework

### Backend

- **Fastify**: High-performance HTTP server
- **WebSocket**: Real-time communication
- **DynamoDB**: NoSQL database
- **Node.js 22**: Latest LTS runtime

### Cloud Infrastructure

- **AWS ECS Fargate**: Container orchestration
- **AWS Lambda**: Serverless functions
- **AWS CloudFront**: Global CDN
- **AWS DynamoDB**: Database
- **AWS S3**: Static hosting
- **AWS API Gateway**: REST API management

### AI & Machine Learning

- **Claude 3.5 Sonnet**: Advanced language model
- **Anthropic SDK**: Official API client
- **Prompt Engineering**: Optimized security prompts

### DevOps & CI/CD

- **GitHub Actions**: Automated deployment
- **Docker**: Containerization
- **CloudFormation**: Infrastructure as code
- **Lighthouse CI**: Performance monitoring

## Quick Start

### Prerequisites

- Node.js 22+
- AWS CLI configured
- Docker (for local development)

### Installation

1. **Clone and install**

   ```bash
   git clone https://github.com/jessemull/wraithwatch.git
   cd wraithwatch
   yarn install
   ```

2. **Start development**

   ```bash
   yarn dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:8080
   - ChatBot: http://localhost:3001

## Deployment

### Production Environment

- **Frontend**: GH Actions + Cloudformation + S3 + CloudFront (Global CDN)
- **API**: GH Actions + Cloudformation + ECS Fargate (Container orchestration)
- **Database**: Cloudformation + DynamoDB (NoSQL)
- **ChatBot**: GH Actions + Cloudformation + Lambda + API Gateway (Serverless)
- **Edge Functions**: GH Actions + Cloudformation + CloudFront Lambda@Edge

### CI/CD Pipeline

- **GitHub Actions**: Automated testing and deployment
- **Docker**: Containerized applications
- **CloudFormation**: Infrastructure as code
- **Monitoring**: CloudWatch and Lighthouse CI

## Performance Metrics

- **Build Time**: 3 days (part-time development)
- **Lighthouse Score**: 95+ Performance, 100 Accessibility, 100 Best Practices, 100 SEO
- **WebSocket Latency**: <100ms
- **Test Coverage**: >90%
- **Deployment**: Fully automated CI/CD
- **Uptime**: Production-ready monitoring

## 🎯 Startup Success Factors

This project demonstrates key qualities for startup success:

### **Rapid Development**

- Built a full-stack application in just 3 days
- Balanced development with full-time work and family
- Demonstrated ability to ship quickly under constraints

### **Technical Versatility**

- **Full-Stack Development**: Frontend, backend, database, cloud
- **Multiple Technologies**: React, Node.js, AWS, AI/ML
- **DevOps Skills**: CI/CD, containerization, infrastructure
- **Testing & Quality**: Comprehensive testing and monitoring

### **Problem-Solving Approach**

- **Architecture Design**: Scalable microservices architecture
- **Performance Optimization**: Real-time data streaming
- **User Experience**: Intuitive 3D visualizations
- **Production Readiness**: Monitoring, logging, error handling

### **Modern Development Practices**

- **TypeScript**: Type-safe development
- **Testing**: Unit, integration, and E2E testing
- **Code Quality**: ESLint, Prettier, coverage thresholds
- **Documentation**: Comprehensive README files

## Future Enhancements

### Data Pipeline & Intelligence

- **Real Streaming Integration**: Replace mock data with AWS Kinesis, Apache Kafka, or Apache Pulsar
- **Threat Intelligence**: Connect ChatBot to DynamoDB for context-aware threat analysis
- **Machine Learning**: Implement ML-powered threat detection and risk scoring
- **Data Quality**: Schema validation, data cleansing, and anomaly detection

### Scalability & Performance

- **Micro-frontends**: Webpack code splitting for modular architecture
- **Horizontal Scaling**: Auto-scaling ECS services and database sharding
- **Advanced Caching**: Redis for high-frequency data and multi-layer caching
- **Time-series Database**: InfluxDB or TimescaleDB for historical analytics

### Security & Compliance

- **Authentication**: JWT tokens, OAuth2, or AWS Cognito integration
- **Authorization**: Role-based access control (RBAC) and audit logging
- **Data Encryption**: At-rest and in-transit encryption with compliance features
- **Security Monitoring**: Distributed tracing with AWS X-Ray and real-time alerts

### User Experience & Analytics

- **Progressive Web App**: Offline capabilities and mobile optimization
- **Advanced Visualizations**: Geographic mapping and collaborative features
- **Customizable Dashboard**: Theme switching and configurable layouts
- **Real-time Analytics**: Advanced analytics dashboard with retention policies

---

**Built for Wraithwatch Cybersecurity - Demonstrating rapid development and technical excellence**

_This project showcases the ability to rapidly build production-ready applications while balancing professional and personal commitments. It demonstrates modern development practices, cloud architecture expertise, and the versatility needed to succeed in a startup environment._
