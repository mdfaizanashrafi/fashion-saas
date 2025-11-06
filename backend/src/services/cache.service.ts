import Redis from 'redis'

class CacheService {
  private client: Redis.RedisClientType | null = null

  async connect(): Promise<void> {
    if (this.client) return

    try {
      this.client = Redis.createClient({
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
        password: process.env.REDIS_PASSWORD || undefined,
      })

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err)
      })

      await this.client.connect()
      console.log('✅ Connected to Redis')
    } catch (error) {
      console.warn('⚠️ Redis not available, caching disabled:', error)
      this.client = null
    }
  }

  async get(key: string): Promise<any | null> {
    if (!this.client) return null

    try {
      const value = await this.client.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    if (!this.client) return

    try {
      await this.client.setEx(key, ttlSeconds, JSON.stringify(value))
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.client) return

    try {
      await this.client.del(key)
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  }

  async clearPattern(pattern: string): Promise<void> {
    if (!this.client) return

    try {
      const keys = await this.client.keys(pattern)
      if (keys.length > 0) {
        await this.client.del(keys)
      }
    } catch (error) {
      console.error('Cache clear error:', error)
    }
  }
}

export const cacheService = new CacheService()

