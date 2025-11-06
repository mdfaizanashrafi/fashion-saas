import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { catalogueController } from '../controllers/catalogue.controller'
import { validateFileUpload } from '../middleware/validateUpload'

const router = Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads/temp'
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'), // 50MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'))
  },
})

// Routes
router.post(
  '/generate',
  upload.array('images', 10), // Max 10 files at once
  validateFileUpload,
  catalogueController.generateCatalogue
)

router.get('/status/:jobId', catalogueController.getStatus)

router.get('/download/:itemId', catalogueController.downloadItem)

router.get('/jobs/:userId', catalogueController.getUserJobs)

router.delete('/jobs/:jobId', catalogueController.cancelJob)

export default router

