# Real Estate Content AI (Universal Business Platform)

Welcome to the autonomous development repo. The goal of this application is to serve as an omni-channel publishing tool. It was initially tailored to real estate but is actively expanding to accommodate universal business types.

## Current State

The platform has successfully reached Phase 5 of the roadmap. We've established a full-stack Dockerized ecosystem (Vite/React + Node.js/Express) with SQLite tracking users and AI settings (brand voices). OAuth stub integrations are in place.

## How to run locally

### Docker

```bash
docker build -t app .
docker run -p 3001:3001 -p 5173:5173 app
```

### Manual

Ensure you use Node.js 22.x.

```bash
# Frontend
npm ci
npm run dev &

# Backend
cd server
npm ci
npm run build
npm start &
```
