import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Disable SSL for local PostgreSQL; set PGSSLMODE=require for remote (e.g. Neon)
const ssl = process.env.PGSSLMODE === 'require';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(ssl ? { ssl: { rejectUnauthorized: false } } : {}),
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

/**
 * Execute a database query
 * @param query SQL query string
 * @param values Query parameters for prepared statements
 */
export async function query(text: string, values?: unknown[]) {
  const start = Date.now();
  try {
    const result = await pool.query(text, values);
    const duration = Date.now() - start;
    console.log('[DB] Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('[DB] Query failed', { text, error });
    throw error;
  }
}

/**
 * Get a client connection from the pool
 */
export async function getClient(): Promise<PoolClient> {
  return pool.connect();
}

/**
 * Close the database connection pool
 */
export async function closePool(): Promise<void> {
  await pool.end();
}

/**
 * Run database migrations
 * All migrations are idempotent (safe to run multiple times)
 * Migrations add/alter schema but never drop or destroy data
 */
export async function runMigrations(): Promise<void> {
  try {
    console.log('[Migrations] Starting database migrations...');

    // Migration 1: Expand trainers table with profile fields
    console.log('[Migrations] Migration 1: Expanding trainers table with profile fields...');
    await query(`
      ALTER TABLE trainers ADD COLUMN IF NOT EXISTS bio TEXT;
      ALTER TABLE trainers ADD COLUMN IF NOT EXISTS institution VARCHAR(255);
      ALTER TABLE trainers ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);
      ALTER TABLE trainers ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'unverified';
      ALTER TABLE trainers ADD COLUMN IF NOT EXISTS verification_notes TEXT;
      ALTER TABLE trainers ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
      ALTER TABLE trainers ADD COLUMN IF NOT EXISTS total_uploads INTEGER DEFAULT 0;
      ALTER TABLE trainers ADD COLUMN IF NOT EXISTS total_downloads INTEGER DEFAULT 0;
      ALTER TABLE trainers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
    `);
    console.log('[Migrations] Migration 1 completed');

    // Create indexes for trainers table
    console.log('[Migrations] Creating indexes on trainers table...');
    await query(`
      CREATE INDEX IF NOT EXISTS idx_trainers_verification_status ON trainers(verification_status);
      CREATE INDEX IF NOT EXISTS idx_trainers_is_admin ON trainers(is_admin);
      CREATE INDEX IF NOT EXISTS idx_trainers_created_at ON trainers(created_at DESC);
    `);
    console.log('[Migrations] Trainers indexes completed');

    // Migration 2: Create resources table
    console.log('[Migrations] Migration 2: Creating resources table...');
    await query(`
      CREATE TABLE IF NOT EXISTS resources (
        id UUID PRIMARY KEY,
        trainer_id UUID NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
        title VARCHAR(120) NOT NULL,
        department VARCHAR(50) NOT NULL,
        resource_type VARCHAR(50) NOT NULL,
        description TEXT,
        cbet_units TEXT,
        file_url VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending_review',
        uploaded_at TIMESTAMP NOT NULL,
        approval_date TIMESTAMP,
        approved_by UUID REFERENCES trainers(id) ON DELETE SET NULL,
        rejection_reason TEXT,
        download_count INTEGER DEFAULT 0,
        rating FLOAT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('[Migrations] Migration 2 completed');

    // Create indexes for resources table
    console.log('[Migrations] Creating indexes on resources table...');
    await query(`
      CREATE INDEX IF NOT EXISTS idx_resources_trainer_id ON resources(trainer_id);
      CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
      CREATE INDEX IF NOT EXISTS idx_resources_department ON resources(department);
      CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_resources_approval_date ON resources(approval_date DESC);
      CREATE INDEX IF NOT EXISTS idx_resources_status_created ON resources(status, created_at DESC);
    `);
    console.log('[Migrations] Resources indexes completed');

    // Migration 3: Create downloads table for analytics
    console.log('[Migrations] Migration 3: Creating downloads table...');
    await query(`
      CREATE TABLE IF NOT EXISTS downloads (
        id UUID PRIMARY KEY,
        resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
        trainer_id UUID REFERENCES trainers(id) ON DELETE SET NULL,
        ip_hash VARCHAR(255),
        downloaded_at TIMESTAMP NOT NULL,
        retention_seconds INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('[Migrations] Migration 3 completed');

    // Create indexes for downloads table
    console.log('[Migrations] Creating indexes on downloads table...');
    await query(`
      CREATE INDEX IF NOT EXISTS idx_downloads_resource_id ON downloads(resource_id);
      CREATE INDEX IF NOT EXISTS idx_downloads_trainer_id ON downloads(trainer_id);
      CREATE INDEX IF NOT EXISTS idx_downloads_created_at ON downloads(created_at DESC);
    `);
    console.log('[Migrations] Downloads indexes completed');

    // Migration 4: Create subscriptions table
    console.log('[Migrations] Migration 4: Creating subscriptions table...');
    await query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY,
        trainer_id UUID NOT NULL UNIQUE REFERENCES trainers(id) ON DELETE CASCADE,
        subscription_status VARCHAR(50) DEFAULT 'inactive',
        plan_type VARCHAR(50) DEFAULT 'free',
        plan_amount INTEGER DEFAULT 0,
        currency VARCHAR(3) DEFAULT 'KES',
        billing_cycle_start TIMESTAMP,
        billing_cycle_end TIMESTAMP,
        auto_renew BOOLEAN DEFAULT TRUE,
        cancellation_reason TEXT,
        cancelled_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('[Migrations] Migration 4 completed');

    // Create indexes for subscriptions table
    console.log('[Migrations] Creating indexes on subscriptions table...');
    await query(`
      CREATE INDEX IF NOT EXISTS idx_subscriptions_trainer_id ON subscriptions(trainer_id);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_subscription_status ON subscriptions(subscription_status);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_billing_cycle_end ON subscriptions(billing_cycle_end);
    `);
    console.log('[Migrations] Subscriptions indexes completed');

    // Migration 5: Create payment_history table
    console.log('[Migrations] Migration 5: Creating payment_history table...');
    await query(`
      CREATE TABLE IF NOT EXISTS payment_history (
        id UUID PRIMARY KEY,
        trainer_id UUID NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
        subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
        amount INTEGER NOT NULL,
        currency VARCHAR(3) DEFAULT 'KES',
        status VARCHAR(50) NOT NULL,
        payment_method VARCHAR(50),
        payment_provider_id VARCHAR(255),
        receipt_url VARCHAR(255),
        description VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('[Migrations] Migration 5 completed');

    // Create indexes for payment_history table
    console.log('[Migrations] Creating indexes on payment_history table...');
    await query(`
      CREATE INDEX IF NOT EXISTS idx_payment_history_trainer_id ON payment_history(trainer_id);
      CREATE INDEX IF NOT EXISTS idx_payment_history_status ON payment_history(status);
      CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON payment_history(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_payment_history_provider_id ON payment_history(payment_provider_id);
    `);
    console.log('[Migrations] Payment history indexes completed');

    // Migration 6: Create payment_plans table
    console.log('[Migrations] Migration 6: Creating payment_plans table...');
    await query(`
      CREATE TABLE IF NOT EXISTS payment_plans (
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        plan_type VARCHAR(50) NOT NULL UNIQUE,
        amount INTEGER NOT NULL,
        currency VARCHAR(3) DEFAULT 'KES',
        billing_interval INTEGER DEFAULT 30,
        features JSONB DEFAULT '[]'::jsonb,
        description TEXT,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('[Migrations] Migration 6 completed');

    // Seed initial payment plans if table is empty
    console.log('[Migrations] Seeding initial payment plans...');
    const plansCheck = await query('SELECT COUNT(*) FROM payment_plans');
    if (plansCheck.rows[0].count === '0') {
      await query(`
        INSERT INTO payment_plans (id, name, plan_type, amount, billing_interval, features, description, active)
        VALUES 
          (gen_random_uuid(), 'Free', 'free', 0, 0, '["upload_resources", "basic_stats"]'::jsonb, 'Free tier - basic resource uploads', TRUE),
          (gen_random_uuid(), 'Premium Monthly', 'premium_monthly', 9900, 30, '["upload_resources", "advanced_analytics", "download_history", "batch_upload", "priority_support"]'::jsonb, 'Premium features monthly - 99 KES/month', TRUE),
          (gen_random_uuid(), 'Premium Annual', 'premium_annual', 250000, 365, '["upload_resources", "advanced_analytics", "download_history", "batch_upload", "priority_support"]'::jsonb, 'Premium features annual - 2,500 KES/year (save 50%)', TRUE);
      `);
      console.log('[Migrations] Payment plans seeded');
    } else {
      console.log('[Migrations] Payment plans already exist, skipping seed');
    }

    // Migration 7: Add last_downloaded column to resources table
    console.log('[Migrations] Migration 7: Adding last_downloaded column to resources...');
    await query(`
      ALTER TABLE resources ADD COLUMN IF NOT EXISTS last_downloaded TIMESTAMP;
      CREATE INDEX IF NOT EXISTS idx_resources_last_downloaded ON resources(last_downloaded DESC);
      CREATE INDEX IF NOT EXISTS idx_resources_download_count ON resources(download_count DESC);
    `);
    console.log('[Migrations] Migration 7 completed');

    // Migration 8: Create reviews table
    console.log('[Migrations] Migration 8: Creating reviews table...');
    await query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY,
        resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
        trainer_id UUID NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(resource_id, trainer_id)
      );
    `);
    console.log('[Migrations] Migration 8 completed');

    // Create indexes for reviews table
    console.log('[Migrations] Creating indexes on reviews table...');
    await query(`
      CREATE INDEX IF NOT EXISTS idx_reviews_resource_id ON reviews(resource_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_trainer_id ON reviews(trainer_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
      CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
    `);
    console.log('[Migrations] Reviews indexes completed');

    console.log('[Migrations] All migrations completed successfully');
  } catch (error) {
    console.error('[Migrations] Migration failed:', error);
    throw error;
  }
}

export default pool;
