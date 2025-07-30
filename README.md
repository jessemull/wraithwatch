# Wraithwatch - Real-time Entity Monitoring Dashboard

A real-time web interface for monitoring how entities and their properties change over time.

## 🏗️ Architecture

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Node.js WebSocket server for real-time updates
- **Data**: Simulated entity changes with configurable frequency
- **Deployment**: ECS Fargate ready (or local development)

## 📁 Project Structure

```
wraithwatch/
├── apps/
│   ├── frontend/          # Next.js dashboard
│   └── realtime-api/      # WebSocket server
├── shared/                # Shared types and utilities
└── scripts/              # Data generation scripts
```

## 🚀 Quick Start

1. **Install dependencies:**

   ```bash
   yarn install
   ```

2. **Start development servers:**

   ```bash
   yarn dev
   ```

   This starts both the frontend (port 3000) and WebSocket server (port 3001)

3. **Or run individually:**
   ```bash
   yarn dev:frontend    # Frontend only
   yarn dev:realtime    # WebSocket server only
   ```

## 🎯 Features

- Real-time entity monitoring
- Property change timeline visualization
- High-frequency update handling
- Intuitive UI for temporal data navigation

## 🛠️ Development

The project uses Yarn workspaces for monorepo management. Each app in the `apps/` directory is a separate workspace with its own dependencies and scripts.

## 📊 Demo Data

The system generates simulated entity changes including:

- System entities (hostname, CPU usage, network connections)
- User entities (location, activity status)
- Sensor entities (temperature, humidity, pressure)

Changes are broadcast via WebSocket every few seconds for real-time demonstration.
