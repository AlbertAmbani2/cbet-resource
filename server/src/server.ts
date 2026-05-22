import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import trainerRoutes from './routes/trainerRoutes.js';
import { query, runMigrations } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
type DatabaseStatus = 'initializing' | 'ready' | 'unavailable';

let databaseStatus: DatabaseStatus = 'initializing';

/**
 * Middleware
 */
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174']
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: databaseStatus === 'ready' ? 'ok' : databaseStatus,
    database: databaseStatus,
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

/**
 * API routes
 */
app.use('/api/trainers', (req, res, next) => {
  if (databaseStatus !== 'ready') {
    res.status(503).json({
      error: databaseStatus === 'initializing'
        ? 'Database is still initializing. Please try again shortly.'
        : 'Database is unavailable. Check the backend database connection and try again.'
    });
    return;
  }

  next();
}, trainerRoutes);

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/**
 * Error handler
 */
app.use((err: Error, req: express.Request, res: express.Response) => {
  console.error('[Server] Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

/**
 * Initialize database on startup
 * Creates initial trainers table if it doesn't exist
 * Then runs all migrations to ensure schema is up to date
 */
async function initializeDatabase(): Promise<void> {
  try {
    console.log('[DB] Initializing database...');

    // Create trainers table if it doesn't exist (original table)
    await query(`
      CREATE TABLE IF NOT EXISTS trainers (
        id UUID PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        department VARCHAR(50) NOT NULL,
        created_at TIMESTAMP NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE
      );
    `);

    // Create index on email for faster lookups
    await query(`
      CREATE INDEX IF NOT EXISTS idx_trainers_email ON trainers(email);
    `);

    console.log('[DB] Base trainers table initialized');

    // Run all migrations (creates additional columns, tables, indexes)
    await runMigrations();

    console.log('[DB] Database initialization completed successfully');
    databaseStatus = 'ready';
  } catch (error) {
    databaseStatus = 'unavailable';
    console.error('[DB] Failed to initialize database:', error);
  }
}

/**
 * Start server
 */
function start(): void {
  app.listen(PORT, () => {
    console.log(`[Server] CBET Backend running on http://localhost:${PORT}`);
    console.log(`[Server] Environment: ${NODE_ENV}`);
    console.log(`[Server] Health check: GET http://localhost:${PORT}/health`);
    console.log(`[Server] Signup endpoint: POST http://localhost:${PORT}/api/trainers/signup`);
    console.log(`[Server] Signin endpoint: POST http://localhost:${PORT}/api/trainers/signin`);
  });

  void initializeDatabase();
}

start();
