# Escore Frontend Deployment Plan

## Overview

This document outlines the deployment strategy for the Escore Next.js admin dashboard frontend to run alongside the backend on the production server (51.20.123.246).

## Current Setup

- **Framework**: Next.js 15.5.4 with App Router
- **Node.js**: Requires 20+
- **Port**: 3000 (default)
- **Backend API**: http://51.20.123.246 (port 5000)
- **GitHub Repo**: https://github.com/mohammed-hamdi26/escore.git

## Server Architecture

```
Production Server (51.20.123.246)
├── Backend API (PM2: escore-backend)
│   ├── Port: 5000
│   └── Path: ~/escore-backend
│
└── Frontend Dashboard (PM2: escore-frontend)
    ├── Port: 3000
    └── Path: ~/escore-frontend
```

## Deployment Steps

### Step 1: Prepare Environment File

Create `.env.production` on server with:
```bash
NEXT_PUBLIC_BASE_URL=http://51.20.123.246
```

### Step 2: Clone Repository on Server

```bash
ssh -i "escore-key.pem" ubuntu@51.20.123.246
cd ~
git clone https://github.com/mohammed-hamdi26/escore.git escore-frontend
cd escore-frontend
```

### Step 3: Install Dependencies & Build

```bash
npm install
npm run build
```

### Step 4: Create PM2 Ecosystem File

Create `ecosystem.config.cjs` in the frontend directory:
```javascript
module.exports = {
  apps: [{
    name: 'escore-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/home/ubuntu/escore-frontend',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_BASE_URL: 'http://51.20.123.246'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M'
  }]
};
```

### Step 5: Start with PM2

```bash
pm2 start ecosystem.config.cjs
pm2 save
```

### Step 6: Verify Deployment

```bash
curl http://localhost:3000
pm2 status
pm2 logs escore-frontend
```

## Future Deployment Commands

After initial setup, use this command to deploy updates:

```bash
ssh -i "D:\escore-backend\escore-key.pem" ubuntu@51.20.123.246 "cd ~/escore-frontend && git pull origin master && npm install && npm run build && pm2 restart escore-frontend"
```

## Access URLs

- **Frontend Dashboard**: http://51.20.123.246:3000
- **Backend API**: http://51.20.123.246:5000
- **API Docs**: http://51.20.123.246:5000/api-docs

## Notes

- The frontend uses `NEXT_PUBLIC_BASE_URL` to connect to the backend API
- Session management uses httpOnly cookies named "session"
- Supports English and Arabic locales (en, ar)
- All routes are prefixed with locale (e.g., /en/dashboard, /ar/dashboard)
