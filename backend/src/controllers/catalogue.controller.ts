import { Request, Response, NextFunction } from 'express'
import { catalogueService } from '../services/catalogue.service'
import { videoGenerationQueue } from '../queues/videoGeneration.queue'
import { ApiError } from '../utils/ApiError'

class CatalogueController {
  async generateCatalogue(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        throw new ApiError('No files uploaded', 400)
      }

      const files = Array.isArray(req.files) ? req.files : [req.files]
      const userId = req.user?.id || 'anonymous' // Assuming auth middleware adds user

      // Create job for video generation
      const job = await videoGenerationQueue.add('generate-videos', {
        userId,
        files: files.map(file => ({
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size,
        })),
      }, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      })

      // Return job ID immediately (async processing)
      res.status(202).json({
        jobId: job.id,
        status: 'processing',
        message: 'Catalogue generation started. Check status endpoint for updates.',
        estimatedTime: '5-10 minutes',
      })
    } catch (error) {
      next(error)
    }
  }

  async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.params
      
      const status = await catalogueService.getJobStatus(jobId)
      
      if (!status) {
        throw new ApiError('Job not found', 404)
      }

      res.json(status)
    } catch (error) {
      next(error)
    }
  }

  async downloadItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params
      
      const filePath = await catalogueService.getItemDownloadPath(itemId)
      
      if (!filePath) {
        throw new ApiError('Item not found', 404)
      }

      res.download(filePath)
    } catch (error) {
      next(error)
    }
  }

  async getUserJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params
      const { page = 1, limit = 10 } = req.query
      
      const jobs = await catalogueService.getUserJobs(
        userId,
        parseInt(page as string),
        parseInt(limit as string)
      )
      
      res.json(jobs)
    } catch (error) {
      next(error)
    }
  }

  async cancelJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.params
      
      const cancelled = await catalogueService.cancelJob(jobId)
      
      if (!cancelled) {
        throw new ApiError('Job not found or cannot be cancelled', 404)
      }

      res.json({ message: 'Job cancelled successfully' })
    } catch (error) {
      next(error)
    }
  }
}

export const catalogueController = new CatalogueController()

