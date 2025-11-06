import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError'

export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err)

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      details: err.details,
    })
  }

  // Handle multer errors
  if (err.name === 'MulterError') {
    if (err.message === 'File too large') {
      return res.status(400).json({
        error: 'File too large',
        message: 'Maximum file size is 50MB',
      })
    }
    return res.status(400).json({
      error: 'Upload error',
      message: err.message,
    })
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      message: err.message,
    })
  }

  // Default error
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  })
}

