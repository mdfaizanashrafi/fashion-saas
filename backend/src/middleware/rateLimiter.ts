import { Request, Response, NextFunction } from 'express'
import { RateLimiterRedis, RateLimiterMemory } from 'rate-limiter-flexible'
import { cacheService } from '../services/cache.service'
import { ApiError } from '../utils/ApiError'

// Memory-based rate limiter as fallback
const memoryLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10'),
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000') / 1000, // Convert to seconds
})

let redisLimiter: RateLimiterRedis | null = null

// Initialize Redis rate limiter if available
async function initializeRateLimiter() {
  try {
    // Get Redis client from cache service
    await cacheService.connect()
    const cacheServiceAny = cacheService as any
    if (cacheServiceAny.client) {
      redisLimiter = new RateLimiterRedis({
        storeClient: cacheServiceAny.client,
        points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10'),
        duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000') / 1000,
        keyPrefix: 'rl:',
      })
      console.log('✅ Redis rate limiter initialized')
    }
  } catch (error) {
    console.warn('⚠️ Redis rate limiter not available, using memory limiter')
  }
}

initializeRateLimiter()

export async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limiter = redisLimiter || memoryLimiter
    const key = req.user?.id || req.ip || 'anonymous'

    await limiter.consume(key)
    next()
  } catch (error: any) {
    if (error.remainingPoints !== undefined) {
      res.status(429).json({
        error: 'Too many requests',
        message: `Rate limit exceeded. Maximum ${process.env.RATE_LIMIT_MAX_REQUESTS || 10} requests per hour.`,
        retryAfter: Math.round(error.msBeforeNext / 1000),
      })
    } else {
      next(error)
    }
  }
}

