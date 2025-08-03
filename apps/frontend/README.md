# Wraithwatch Frontend Dashboard

A real-time cybersecurity threat monitoring dashboard built with Next.js 14, featuring 3D visualizations, AI-powered analytics, and responsive design for security operations centers.

## 🎯 Overview

The Wraithwatch frontend provides an intuitive interface for security analysts to monitor and understand how cybersecurity entities and their properties change over time. Built with modern web technologies, it demonstrates effective UX patterns for navigating infinite dataspace toward useful outcomes.

## ✨ Features

### 🎨 Dashboard Components
- **Real-time Metrics**: Live threat counts, AI confidence scores, connection tracking
- **KPI Cards**: Active threats, threat scores, AI confidence, total connections
- **Entity Details**: Comprehensive entity information with property evolution
- **Connection Status**: WebSocket connection monitoring with auto-reconnect

### 🌐 3D Visualizations
- **Matrix Visualization**: Threat positioning by severity, detection count, and threat score
- **Network Visualization**: Entity connections with data flow animations
- **Timeline Visualization**: Historical changes with time-based filtering
- **Interactive Controls**: Camera manipulation, entity selection, filtering

### 🤖 AI Integration
- **ChatBot Interface**: AI-powered threat analysis and entity queries
- **Real-time Responses**: Claude 3.5 Sonnet integration
- **Context Awareness**: Entity-specific threat analysis
- **Conversation History**: Persistent chat sessions

### 📊 Data Management
- **Entity Types**: Systems, Threats, AI Agents, Network Nodes
- **Property Evolution**: Dynamic property change tracking
- **Time-series Data**: Historical change visualization
- **Real-time Updates**: WebSocket-powered live data streaming

## 🛠️ Technology Stack

### Core Framework
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **React 18**: Concurrent features and hooks

### 3D Graphics
- **Three.js**: 3D visualization library
- **React Three Fiber**: React renderer for Three.js
- **Drei**: Useful helpers for Three.js
- **Custom Shaders**: Advanced visual effects

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **Headless UI**: Accessible UI components
- **Custom Components**: Specialized cybersecurity components

### State Management
- **React Hooks**: useState, useEffect, useContext
- **Custom Hooks**: useRealTimeData, useWebSocket
- **Context API**: Global state management

### Testing
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Cypress**: End-to-end testing
- **Coverage**: 70%+ threshold

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- Yarn package manager
- WebSocket-capable browser

### Installation

1. **Install dependencies**
   ```bash
   yarn install
   ```

2. **Set environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API endpoints
   ```

3. **Start development server**
   ```bash
   yarn dev
   ```

4. **Open browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
apps/frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # React components
│   │   ├── Charts/            # Chart components
│   │   ├── ChatBot/           # AI chatbot interface
│   │   ├── ConnectionStatus/  # WebSocket status
│   │   ├── Dashboard/         # Main dashboard
│   │   ├── EntitiesList/      # Entity management
│   │   └── Visualizations/    # 3D visualization components
│   ├── config/                # Configuration files
│   ├── constants/             # Application constants
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type definitions
│   └── util/                  # Utility functions
├── public/                    # Static assets
├── cypress/                   # E2E test configuration
└── package.json               # Dependencies and scripts
```

## 🎨 Component Architecture

### Dashboard Components
- **Dashboard.tsx**: Main dashboard layout and orchestration
- **DashboardMetrics.tsx**: Real-time KPI display
- **Header.tsx**: Navigation and status indicators
- **WelcomeSection.tsx**: Onboarding and help content

### Visualization Components
- **Matrix3D.tsx**: 3D matrix visualization for threats
- **NetworkGraph3D.tsx**: Network topology visualization
- **TimelineVisualization.tsx**: Historical data visualization
- **DataParticle.tsx**: Animated data flow particles

### Entity Management
- **EntitiesList.tsx**: Entity listing and filtering
- **EntityItem.tsx**: Individual entity display
- **EntityDetails.tsx**: Detailed entity information
- **EntityGroupHeader.tsx**: Entity type grouping

### AI Integration
- **ChatBot.tsx**: AI chatbot interface
- **ChatBot.test.tsx**: ChatBot component tests

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
yarn cypress:open     # Open Cypress test runner
yarn cypress:run      # Run E2E tests

# Code Quality
yarn lint             # Run ESLint
yarn lint:fix         # Fix linting issues
yarn type-check       # TypeScript type checking
```

### Environment Variables

```bash
# Required
NEXT_PUBLIC_API_URL=https://api.wraithwatch-demo.com
NEXT_PUBLIC_WEBSOCKET_URL=wss://api.wraithwatch-demo.com

# Optional
NEXT_PUBLIC_CHATBOT_URL=https://chatbot.wraithwatch-demo.com
NEXT_PUBLIC_ENVIRONMENT=production
```

### Development Workflow

1. **Start development server**
   ```bash
   yarn dev
   ```

2. **Run tests**
   ```bash
   yarn test
   yarn cypress:run
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
- **React Testing Library**: Component testing utilities
- **Coverage**: 70%+ threshold enforced
- **Mocking**: WebSocket and API mocking

### Integration Testing
- **Cypress**: End-to-end testing
- **Custom Commands**: Reusable test utilities
- **Visual Testing**: Screenshot comparisons
- **Performance Testing**: Lighthouse CI integration

### Test Structure
```
__tests__/
├── components/          # Component unit tests
├── hooks/              # Custom hook tests
├── util/               # Utility function tests
└── cypress/
    └── e2e/           # End-to-end tests
```

## 🎨 Styling Guidelines

### Design System
- **Tailwind CSS**: Utility-first approach
- **Custom Components**: Specialized cybersecurity components
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance

### Color Palette
- **Primary**: Cybersecurity blues and grays
- **Threat Colors**: Red gradients for threat severity
- **Success**: Green for positive metrics
- **Warning**: Yellow/Orange for alerts

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Monospace**: Code and technical data

## 📊 Performance Optimization

### Bundle Optimization
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Route-based splitting
- **Dynamic Imports**: Lazy loading of heavy components
- **Image Optimization**: Next.js image optimization

### Runtime Performance
- **React.memo**: Component memoization
- **useMemo/useCallback**: Hook optimization
- **Virtual Scrolling**: Large list optimization
- **WebGL Optimization**: Three.js performance tuning

### Lighthouse Score
- **Target**: 80+ performance score
- **Optimizations**: 
  - Image compression
  - Bundle size reduction
  - Critical CSS inlining
  - Service worker caching

## 🚀 Deployment

### Production Build
```bash
# Build application
yarn build

# Export static files
yarn export

# Deploy to S3
aws s3 sync out/ s3://wraithwatch-frontend/
```

### CI/CD Pipeline
- **GitHub Actions**: Automated testing and deployment
- **Lighthouse CI**: Performance monitoring
- **CloudFront**: Global CDN distribution
- **S3**: Static hosting

### Environment Configuration
```bash
# Production
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.wraithwatch-demo.com

# Development
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🔍 Monitoring & Analytics

### Performance Monitoring
- **Lighthouse CI**: Automated performance testing
- **Web Vitals**: Core Web Vitals tracking
- **Bundle Analysis**: Webpack bundle analyzer
- **Error Tracking**: Error boundary implementation

### User Analytics
- **WebSocket Monitoring**: Connection status tracking
- **Interaction Tracking**: User behavior analytics
- **Error Logging**: Client-side error reporting
- **Performance Metrics**: Real-time performance data

## 🤝 Contributing

### Development Guidelines
1. **TypeScript**: Strict type checking required
2. **Testing**: Unit tests for new components
3. **Linting**: ESLint rules must pass
4. **Formatting**: Prettier auto-formatting
5. **Accessibility**: WCAG 2.1 AA compliance

### Code Review Process
1. **Feature Branch**: Create from main
2. **Tests**: Ensure all tests pass
3. **Linting**: Fix any linting issues
4. **Performance**: Check Lighthouse scores
5. **Review**: Submit pull request

## 📚 Documentation

### API Documentation
- **WebSocket Events**: Real-time data events
- **REST Endpoints**: API integration points
- **Type Definitions**: TypeScript interfaces
- **Error Handling**: Error response formats

### Component Documentation
- **Props Interface**: Component prop definitions
- **Usage Examples**: Code examples
- **Styling Guide**: CSS class usage
- **Accessibility**: ARIA attributes and roles

---

**Built for Wraithwatch Cybersecurity - Advanced threat intelligence visualization**
