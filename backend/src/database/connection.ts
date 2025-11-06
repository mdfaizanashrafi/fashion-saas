import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

let pool: pg.Pool | null = null

export const db = {
  query: async (text: string, params?: any[]) => {
    if (!pool) {
      throw new Error('Database not initialized. Call setupDatabase() first.')
    }
    return await pool.query(text, params)
  },
  getPool: () => pool,
}

export async function setupDatabase() {
  if (pool) {
    return pool
  }

  try {
    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'fashion_saas',
      user: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'password',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    // Test connection
    await pool.query('SELECT NOW()')
    console.log('✅ Connected to PostgreSQL database')

    // Initialize cache service
    const { cacheService } = await import('../services/cache.service')
    await cacheService.connect()

    // Initialize file storage
    const { fileStorageService } = await import('../services/fileStorage.service')
    await fileStorageService.ensureDirectories()

    return pool
  } catch (error) {
    console.error('❌ Database connection error:', error)
    throw error
  }
}

