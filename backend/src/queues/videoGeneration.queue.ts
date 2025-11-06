import Queue from 'bull'
import { videoGenerationProcessor } from '../processors/videoGeneration.processor'

export const videoGenerationQueue = new Queue('video-generation', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: {
      age: 86400, // Keep completed jobs for 24 hours
      count: 1000,
    },
    removeOnFail: {
      age: 604800, // Keep failed jobs for 7 days
    },
  },
})

// Process jobs
videoGenerationQueue.process('generate-videos', async (job) => {
  return await videoGenerationProcessor.process(job)
})

// Job event listeners
videoGenerationQueue.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed`)
})

videoGenerationQueue.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err)
})

videoGenerationQueue.on('stalled', (job) => {
  console.warn(`⚠️ Job ${job.id} stalled`)
})

export default videoGenerationQueue

