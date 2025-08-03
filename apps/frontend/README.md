# Wraithwatch Frontend

A modern React-based cybersecurity dashboard built with Next.js 15 and TypeScript, designed to provide real-time threat monitoring and entity visualization through interactive 3D renderings and dynamic charts.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Component Architecture](#component-architecture)
- [Development](#development)
- [Deployment](#deployment)
- [Performance Optimization](#performance-optimization)
- [Monitoring & Analytics](#monitoring--analytics)

## Overview

The Wraithwatch Frontend provides an intuitive cybersecurity dashboard that displays real-time entity updates, threat monitoring, and interactive 3D visualizations. Built with modern web technologies, it demonstrates effective patterns for real-time data visualization and user experience design in security operations.

## Features

### Dashboard Components
- **Real-time Entity List**: Live entity updates with property changes
- **Interactive Charts**: Dynamic metrics visualization with Chart.js
- **Entity Details Panel**: Detailed entity information and history
- **Connection Status**: WebSocket connection monitoring
- **Welcome Section**: User onboarding and system status

### 3D Visualizations
- **Timeline Visualization**: Time-based entity progression
- **Network Visualization**: Entity relationships and connections
- **Matrix Visualization**: Spatial entity positioning
- **Dynamic Loading**: Lazy-loaded 3D components for performance
- **Entity Selection**: Interactive entity selection and highlighting

### Real-time Data Integration
- **WebSocket Communication**: Real-time data streaming
- **REST API Integration**: Historical data and metrics
- **Data Transformation**: Entity change to visualization mapping
- **Error Handling**: Graceful connection and data error management
- **Connection Recovery**: Automatic WebSocket reconnection

### User Experience
- **Responsive Design**: Mobile and desktop optimization
- **Loading States**: Smooth loading transitions
- **Error Boundaries**: Graceful error handling
- **Performance Monitoring**: Lighthouse CI integration
- **Accessibility**: WCAG compliance features

## Technology Stack

### Core Framework
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling

### 3D Visualization
- **Three.js**: 3D graphics library
- **React Three Fiber**: React renderer for Three.js
- **Drei**: Three.js helpers and utilities
- **Framer Motion**: Animation library

### Data Visualization
- **Chart.js**: Interactive charts and graphs
- **React Chart.js 2**: React wrapper for Chart.js
- **Lucide React**: Icon library

### Development Tools
- **Jest**: Testing framework
- **ESLint**: Code linting
- **Cypress**: End-to-end testing
- **Lighthouse CI**: Performance monitoring

### CI/CD
- **GitHub Actions**: Deployment workflows
- **AWS S3**: Static website hosting
- **CloudFront**: Global CDN
- **CloudFormation**: Infrastructure management

## Quick Start

### Prerequisites
- Node.js 22+
- Yarn package manager
- API and WebSocket endpoints configured

### Installation

1. **Install dependencies**
   ```bash
   yarn install
   ```

2. **Set environment variables**
   ```bash
   # Edit .env.local with environment variables (see below)
   touch .env.local
   ```

3. **Start development server**
   ```bash
   yarn dev
   ```

4. **Open the application**
   ```bash
   # Navigate to http://localhost:3000
   ```

## Project Structure

```
apps/frontend/
├── src/
│   ├── app/                   # Next.js App Router
│   ├── components/            # React components
│   │   ├── Charts/            # Chart.js components
│   │   ├── Dashboard/         # Dashboard components
│   │   ├── EntitiesList/      # Entity list components
│   │   └── Visualizations/    # 3D visualization components
│   ├── config/                # Application configuration
│   ├── constants/             # Application constants
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type definitions
│   └── util/                  # Utility functions
├── public/                    # Static assets
├── cypress/                   # End-to-end tests
└── package.json               # Dependencies and scripts
```

## Component Architecture

### Dashboard Components
- **Dashboard**: Main dashboard container and layout
- **Header**: Navigation and connection status
- **DashboardMetrics**: Real-time metrics display
- **EntityDetails**: Entity information panel
- **VisualizationControls**: 3D visualization controls
- **WelcomeSection**: User onboarding section

### Visualization Components
- **TimelineVisualization**: Time-based entity progression
- **NetworkGraph3D**: Entity relationship visualization
- **Matrix3D**: Spatial entity positioning
- **EntityNode**: Individual entity representation
- **ControlPanel**: Visualization controls

### Chart Components
- **BarChart**: Vertical bar chart component
- **LineChart**: Time-series line chart
- **PieChart**: Pie chart component
- **DoughnutChart**: Doughnut chart component
- **HorizontalBarChart**: Horizontal bar chart

### Entity Components
- **EntitiesList**: Entity list container
- **EntityItem**: Individual entity item
- **EntityGroupHeader**: Entity group headers
- **ConnectionStatus**: WebSocket connection status

## Development

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
yarn coverage:open    # Open coverage report

# E2E Testing
yarn e2e              # Run Cypress tests
yarn e2e:open         # Open Cypress UI

# Code Quality
yarn lint             # Run ESLint

# Performance
yarn lighthouse       # Run Lighthouse CI
```

### Environment Variables

```bash
# Required
NEXT_PUBLIC_API_URL=https://api.wraithwatch-demo.com
NEXT_PUBLIC_WEBSOCKET_URL=wss://api.wraithwatch-demo.com/ws

# Optional
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development
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
   yarn build
   ```

## Deployment

### GitHub Actions Deployment

The Frontend is deployed via GitHub Actions workflow and AWS S3/CloudFront:

1. **Automatic Trigger**: Deploy on push to main branch
2. **Build Process**: 
   - Install dependencies
   - Lint code
   - Run unit tests
   - Check coverage threshold (70%)
   - Build Next.js application
   - Copy sitemap and robots files

3. **S3 Deployment**:
   - Upload build artifacts to S3 bucket
   - Sync with CloudFront distribution
   - Set environment variables

### Deployment Steps

1. **Trigger Deployment**
   ```bash
   # Push to main branch or trigger workflow manually
   git push origin main
   ```

2. **Monitor Deployment**
   - Watch GitHub Actions workflow
   - Check S3 bucket upload
   - Verify CloudFront distribution
   - Monitor build artifacts

3. **Verify Deployment**
   ```bash
   # Test production site
   curl https://www.wraithwatch-demo.com
   
   # Check WebSocket connection
   wscat -c wss://api.wraithwatch-demo.com/ws
   ```

## Infrastructure Components

- **S3 Bucket**: `wraithwatch-frontend` for static hosting
- **CloudFront Distribution**: Global CDN with custom domain
- **Route 53**: DNS management for custom domain
- **ACM Certificate**: SSL certificate for HTTPS
- **CloudFormation**: Infrastructure management

## Performance Optimization

### Next.js Optimization
- **App Router**: Latest Next.js routing system
- **Static Generation**: Pre-rendered pages for performance
- **Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic code splitting
- **Bundle Analysis**: Webpack bundle analysis

### 3D Visualization Optimization
- **Lazy Loading**: Dynamic imports for 3D components
- **Three.js Optimization**: Efficient 3D rendering
- **Memory Management**: Proper cleanup and disposal
- **Frame Rate Optimization**: 60fps rendering targets

### Data Optimization
- **WebSocket Efficiency**: Optimized real-time communication
- **Caching Strategy**: Client-side data caching
- **Error Recovery**: Graceful error handling
- **Connection Management**: Efficient WebSocket management

### Build Optimization
- **Tree Shaking**: Unused code elimination
- **Minification**: Code and asset minification
- **Compression**: Gzip and Brotli compression
- **CDN Integration**: Global content delivery

## Monitoring & Analytics

### Performance Monitoring
- **Lighthouse CI**: Automated performance testing
- **Core Web Vitals**: Performance metrics monitoring
- **Bundle Analysis**: JavaScript bundle size tracking
- **Load Time Monitoring**: Page load time tracking

### Error Monitoring
- **Error Boundaries**: React error boundary implementation
- **Console Logging**: Development error logging
- **User Feedback**: Error reporting mechanisms
- **Debugging Tools**: Development debugging utilities

### Analytics Integration
- **User Interaction**: User behavior tracking
- **Performance Metrics**: Real user monitoring
- **Error Tracking**: Error rate monitoring
- **Conversion Tracking**: User journey analysis

---

**Built for Wraithwatch Cybersecurity - Modern real-time cybersecurity dashboard**
