import { Job } from 'bull'
import { db } from '../database/connection'
import { aiVideoService } from '../services/aiVideo.service'
import { fileStorageService } from '../services/fileStorage.service'
import { CatalogueItem } from '../types/catalogue.types'

interface VideoGenerationJobData {
  userId: string
  files: Array<{
    filename: string
    originalname: string
    path: string
    mimetype: string
    size: number
  }>
}

class VideoGenerationProcessor {
  async process(job: Job<VideoGenerationJobData>) {
    const { userId, files } = job.data

    try {
      // Initialize job in database
      const jobResult = await db.query(
        `INSERT INTO catalogue_jobs (job_id, user_id, status, progress, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING *`,
        [job.id, userId, 'processing', 0]
      )

      const allItems: CatalogueItem[] = []

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const progress = Math.round(((i + 1) / files.length) * 100)

        // Update job progress
        await job.progress(progress)
        await db.query(
          'UPDATE catalogue_jobs SET progress = $1, updated_at = NOW() WHERE job_id = $2',
          [progress, job.id]
        )

        try {
          // Generate AI videos and images
          const generatedItems = await aiVideoService.generateCatalogueContent(file)

          // Save items to database
          for (const item of generatedItems) {
            const itemResult = await db.query(
              `INSERT INTO catalogue_items 
               (item_id, job_id, title, type, thumbnail_url, file_path, metadata, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
               RETURNING *`,
              [
                item.id,
                job.id,
                item.title,
                item.type,
                item.thumbnailUrl,
                item.downloadUrl,
                JSON.stringify(item.metadata),
              ]
            )

            allItems.push(item)
          }
        } catch (fileError) {
          console.error(`Error processing file ${file.originalname}:`, fileError)
          // Continue with other files
        }
      }

      // Mark job as completed
      await db.query(
        `UPDATE catalogue_jobs 
         SET status = $1, progress = $2, updated_at = NOW() 
         WHERE job_id = $3`,
        ['completed', 100, job.id]
      )

      return {
        jobId: job.id,
        items: allItems,
        totalItems: allItems.length,
      }
    } catch (error) {
      // Mark job as failed
      await db.query(
        `UPDATE catalogue_jobs 
         SET status = $1, error = $2, updated_at = NOW() 
         WHERE job_id = $3`,
        ['failed', (error as Error).message, job.id]
      )

      throw error
    }
  }
}

export const videoGenerationProcessor = new VideoGenerationProcessor()

