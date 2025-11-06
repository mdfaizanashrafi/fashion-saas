import express, { Express } from 'express'
import cors from 'cors'
import path from 'path'
import catalogueRoutes from './routes/catalogue.routes'
import trendsRoutes from './routes/trends.routes'
import healthRoutes from './routes/health.routes'
import { errorHandler } from './middleware/errorHandler'
import { rateLimiter } from './middleware/rateLimiter'

export function createServer(): Express {
  const app = express()

  // Middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }))
  
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))

  // Serve static files (uploads)
  const publicDir = process.env.PUBLIC_UPLOAD_DIR || './public/uploads'
  app.use('/uploads', express.static(path.resolve(publicDir)))

  // Request logging
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
    next()
  })

  // Health check
  app.use('/api/health', healthRoutes)

  // API Routes
  app.use('/api/catalogue', rateLimiter, catalogueRoutes)
  app.use('/api/trends', trendsRoutes)

  // Error handling
  app.use(errorHandler)

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ 
      error: 'Not Found',
      message: `Route ${req.path} not found` 
    })
  })

  return app
}

