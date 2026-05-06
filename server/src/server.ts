import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import trainerRoutes from './routes/trainerRoutes';
import { query } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Middleware
 */
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

/**
 * API routes
 */
app.use('/api/trainers', trainerRoutes);

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/**
 * Error handler
 */
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Server] Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

/**
 * Initialize database on startup
 */
async function initializeDatabase(): Promise<void> {
  try {
    console.log('[DB] Initializing database...');

    // Create trainers table if it doesn't exist
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

    console.log('[DB] Database initialized successfully');
  } catch (error) {
    console.error('[DB] Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Start server
 */
async function start(): Promise<void> {
  try {
    // Initialize database
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`[Server] CBET Backend running on http://localhost:${PORT}`);
      console.log(`[Server] Environment: ${NODE_ENV}`);
      console.log(`[Server] Health check: GET http://localhost:${PORT}/health`);
      console.log(`[Server] Signup endpoint: POST http://localhost:${PORT}/api/trainers/signup`);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
}

start();
