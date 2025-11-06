import { JobStatus, CatalogueItem } from '../types/catalogue.types'
import { db } from '../database/connection'
import { videoGenerationQueue } from '../queues/videoGeneration.queue'
import { fileStorageService } from './fileStorage.service'

class CatalogueService {
  async getJobStatus(jobId: string): Promise<JobStatus | null> {
    try {
      // Check job in Bull queue
      const job = await videoGenerationQueue.getJob(jobId)
      
      if (!job) {
        // Check database for completed jobs
        const result = await db.query(
          'SELECT * FROM catalogue_jobs WHERE job_id = $1',
          [jobId]
        )
        
        if (result.rows.length === 0) {
          return null
        }

        const dbJob = result.rows[0]
        return {
          jobId: dbJob.job_id,
          status: dbJob.status,
          progress: dbJob.progress || 0,
          items: dbJob.items || [],
          error: dbJob.error || null,
          createdAt: dbJob.created_at,
          updatedAt: dbJob.updated_at,
        }
      }

      // Get job state
      const state = await job.getState()
      const progress = typeof job.progress === 'function' ? await job.progress() : ((job as unknown as { progress?: number }).progress ?? 0)
      
      // Fetch items if job is completed
      let items: CatalogueItem[] = []
      if (state === 'completed') {
        items = await this.getJobItems(jobId)
      }

      const mappedStatus = ((): 'processing' | 'completed' | 'failed' | 'cancelled' => {
        if (state === 'completed') return 'completed'
        if (state === 'failed' || state === 'stuck') return 'failed'
        // Map all other Bull states to 'processing'
        return 'processing'
      })()

      return {
        jobId: job.id as string,
        status: mappedStatus,
        progress,
        items,
        error: (job as any).failedReason || null,
        createdAt: new Date((job as any).timestamp),
        updatedAt: new Date(),
      }
    } catch (error) {
      console.error('Error getting job status:', error)
      return null
    }
  }

  async getJobItems(jobId: string): Promise<CatalogueItem[]> {
    const result = await db.query(
      'SELECT * FROM catalogue_items WHERE job_id = $1 ORDER BY created_at',
      [jobId]
    )

    return result.rows.map(row => ({
      id: row.item_id,
      title: row.title,
      type: row.type,
      thumbnailUrl: row.thumbnail_url,
      downloadUrl: `/api/catalogue/download/${row.item_id}`,
      metadata: row.metadata,
      createdAt: row.created_at,
    }))
  }

  async getUserJobs(userId: string, page: number, limit: number) {
    const offset = (page - 1) * limit

    const result = await db.query(
      `SELECT * FROM catalogue_jobs 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    )

    const countResult = await db.query(
      'SELECT COUNT(*) FROM catalogue_jobs WHERE user_id = $1',
      [userId]
    )

    return {
      jobs: result.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].count),
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
      },
    }
  }

  async cancelJob(jobId: string): Promise<boolean> {
    try {
      const job = await videoGenerationQueue.getJob(jobId)
      
      if (!job) {
        return false
      }

      await job.remove()
      
      // Update database
      await db.query(
        'UPDATE catalogue_jobs SET status = $1, updated_at = NOW() WHERE job_id = $2',
        ['cancelled', jobId]
      )

      return true
    } catch (error) {
      console.error('Error cancelling job:', error)
      return false
    }
  }

  async getItemDownloadPath(itemId: string): Promise<string | null> {
    const result = await db.query(
      'SELECT file_path FROM catalogue_items WHERE item_id = $1',
      [itemId]
    )

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0].file_path
  }
}

export const catalogueService = new CatalogueService()

