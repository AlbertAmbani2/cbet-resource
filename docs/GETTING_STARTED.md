# Getting Started

## Prerequisites

- Node.js 18+
- Yarn (for backend)
- npm (for frontend)
- PostgreSQL database (local)

## Environment Setup

### 1. Backend (`server/`)

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cbet_resource
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

> **Note:** The default `DATABASE_URL` connects to a local PostgreSQL instance.  
> To switch back to a remote provider (e.g. Neon), set `PGSSLMODE=require` in the environment — this enables SSL and sets `rejectUnauthorized: false`.

### 2. Frontend (root)

A root `.env` already exists:

```env
VITE_API_URL=http://localhost:3000
VITE_REQUIRE_EMAIL_VERIFICATION=false
```

## Run the App

### Terminal 1 — Backend

```bash
cd server
yarn install
yarn dev          # http://localhost:3000
```

Verify: `curl http://localhost:3000/health` → `{ "status": "ok" }`

Before starting, make sure your local PostgreSQL is running and the database exists:

```bash
createdb cbet_resource
# or via psql:
psql -U postgres -c "CREATE DATABASE cbet_resource;"
```

### Terminal 2 — Frontend

```bash
npm install
npm run dev       # http://localhost:5173
```

## Seed Data

```bash
cd server
yarn seed:resources
```

## Run Tests

```bash
# Frontend tests
npm run test

# Backend tests
cd server && yarn test
```
