import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from './server'
import { setupDatabase } from './database/connection'

dotenv.config()

const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    // Initialize database connection
    await setupDatabase()
    
    // Create Express app
    const app = createServer()
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

