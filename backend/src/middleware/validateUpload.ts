import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError'

export function validateFileUpload(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.files) {
    throw new ApiError('No files uploaded', 400, 'NO_FILES')
  }

  // Multer can set req.files as an array or a dict of arrays depending on configuration
  let filesArray: Express.Multer.File[] = []
  if (Array.isArray(req.files)) {
    filesArray = req.files as Express.Multer.File[]
  } else {
    const filesDict = req.files as Record<string, Express.Multer.File[]>
    filesArray = Object.values(filesDict).flat()
  }

  if (filesArray.length === 0) {
    throw new ApiError('No files uploaded', 400, 'NO_FILES')
  }

  const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '52428800') // 50MB

  for (const file of filesArray) {
    if (file.size > maxFileSize) {
      throw new ApiError(
        `File ${file.originalname} exceeds maximum size of ${maxFileSize / 1024 / 1024}MB`,
        400,
        'FILE_TOO_LARGE'
      )
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.mimetype)) {
      throw new ApiError(
        `File ${file.originalname} has invalid type. Only JPEG, PNG, and WebP are allowed.`,
        400,
        'INVALID_FILE_TYPE'
      )
    }
  }

  next()
}

