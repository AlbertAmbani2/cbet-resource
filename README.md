# cbet-resource

A full-stack CBET (Competency-Based Education & Training) digital marketplace. Trainers upload educational resources, admins review and publish them, learners browse and download for free.

## Quick Start

```bash
# Backend (server/)
cd server
cp .env.example .env    # edit DATABASE_URL
yarn dev                # starts on :3000

# Frontend (root)
npm run dev             # starts on :5173
```

## Structure

```
src/          → React + TypeScript frontend
server/       → Express + PostgreSQL backend
shared/       → Types & constants shared between both
docs/         → Architecture, API, setup guides
```

## Docs

| Doc | What it covers |
| --- | --- |
| [Getting Started](docs/GETTING_STARTED.md) | Full setup walkthrough |
| [API Reference](docs/API.md) | All endpoints, request/response shapes |
| [Architecture](docs/ARCHITECTURE.md) | Frontend & backend design |
| [Status](docs/STATUS.md) | Current implementation state & priorities |
