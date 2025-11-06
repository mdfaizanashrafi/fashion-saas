import { setupDatabase, db } from './connection'

async function migrate() {
  try {
    await setupDatabase()

    console.log('Running database migrations...')

    // Create catalogue_jobs table
    await db.query(`
      CREATE TABLE IF NOT EXISTS catalogue_jobs (
        id SERIAL PRIMARY KEY,
        job_id VARCHAR(255) UNIQUE NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'processing',
        progress INTEGER DEFAULT 0,
        items JSONB,
        error TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Create catalogue_items table
    await db.query(`
      CREATE TABLE IF NOT EXISTS catalogue_items (
        id SERIAL PRIMARY KEY,
        item_id VARCHAR(255) UNIQUE NOT NULL,
        job_id VARCHAR(255) NOT NULL REFERENCES catalogue_jobs(job_id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        type VARCHAR(50) NOT NULL,
        thumbnail_url TEXT NOT NULL,
        file_path TEXT NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Create indexes
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_catalogue_jobs_user_id 
      ON catalogue_jobs(user_id)
    `)

    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_catalogue_jobs_status 
      ON catalogue_jobs(status)
    `)

    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_catalogue_items_job_id 
      ON catalogue_items(job_id)
    `)

    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_catalogue_items_type 
      ON catalogue_items(type)
    `)

    console.log('✅ Database migrations completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration error:', error)
    process.exit(1)
  }
}

migrate()

