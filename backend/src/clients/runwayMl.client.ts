import axios, { AxiosInstance } from 'axios'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

interface GenerateImageOptions {
  pose?: string
  angle?: string
}

interface GenerateVideoOptions {
  duration?: number
  angle?: string
  movement?: string
  style?: string
  cameraAngles?: string[]
  walking?: boolean
}

interface GenerationResult {
  imagePath?: string
  videoPath?: string
  thumbnailPath: string
  angle?: string
  cameraAngles?: string[]
}

class RunwayMlClient {
  private client: AxiosInstance
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.RUNWAY_ML_API_KEY || ''
    this.baseUrl = process.env.RUNWAY_ML_API_URL || 'https://api.runwayml.com/v1'
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 300000, // 5 minutes for video generation
    })
  }

  /**
   * Generate model image from dress image
   * In production, this would call Runway ML's image-to-image API
   */
  async generateModelImage(
    imagePath: string,
    options: GenerateImageOptions = {}
  ): Promise<GenerationResult> {
    // Mock implementation - replace with actual Runway ML API call
    if (!this.apiKey || this.apiKey === 'your-runway-ml-api-key') {
      return this.mockGenerateImage(imagePath, options)
    }

    try {
      // Read image file
      const imageBuffer = await fs.readFile(imagePath)
      const imageBase64 = imageBuffer.toString('base64')

      // Call Runway ML API
      const response = await this.client.post('/image-to-model', {
        image: imageBase64,
        pose: options.pose || 'standing',
        angle: options.angle || 'front',
        style: 'realistic',
        diversity: true,
      })

      // Download generated image
      const generatedImagePath = await this.downloadImage(response.data.image_url)
      
      // Generate thumbnail
      const thumbnailPath = await this.generateThumbnail(generatedImagePath)

      return {
        imagePath: generatedImagePath,
        thumbnailPath,
        angle: options.angle,
      }
    } catch (error) {
      console.error('Runway ML API error:', error)
      // Fallback to mock
      return this.mockGenerateImage(imagePath, options)
    }
  }

  /**
   * Generate video from dress image
   * In production, this would call Runway ML's image-to-video API
   */
  async generateVideo(
    imagePath: string,
    options: GenerateVideoOptions = {}
  ): Promise<GenerationResult> {
    // Mock implementation - replace with actual Runway ML API call
    if (!this.apiKey || this.apiKey === 'your-runway-ml-api-key') {
      return this.mockGenerateVideo(imagePath, options)
    }

    try {
      const imageBuffer = await fs.readFile(imagePath)
      const imageBase64 = imageBuffer.toString('base64')

      const response = await this.client.post('/image-to-video', {
        image: imageBase64,
        duration: options.duration || 15,
        angle: options.angle,
        movement: options.movement,
        style: options.style,
        camera_angles: options.cameraAngles,
        walking: options.walking || false,
      })

      // Poll for job completion
      const jobId = response.data.job_id
      const videoUrl = await this.waitForJobCompletion(jobId)

      // Download generated video
      const generatedVideoPath = await this.downloadVideo(videoUrl)
      
      // Generate thumbnail
      const thumbnailPath = await this.generateThumbnailFromVideo(generatedVideoPath)

      return {
        videoPath: generatedVideoPath,
        thumbnailPath,
        angle: options.angle,
        cameraAngles: options.cameraAngles,
      }
    } catch (error) {
      console.error('Runway ML API error:', error)
      // Fallback to mock
      return this.mockGenerateVideo(imagePath, options)
    }
  }

  private async waitForJobCompletion(jobId: string, maxAttempts = 60): Promise<string> {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await this.client.get(`/jobs/${jobId}`)
      
      if (response.data.status === 'completed') {
        return response.data.video_url
      }
      
      if (response.data.status === 'failed') {
        throw new Error('Video generation failed')
      }

      // Wait 5 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 5000))
    }

    throw new Error('Video generation timeout')
  }

  private async downloadImage(url: string): Promise<string> {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const filePath = path.join(process.env.UPLOAD_DIR || './uploads/temp', `${uuidv4()}.jpg`)
    await fs.writeFile(filePath, response.data)
    return filePath
  }

  private async downloadVideo(url: string): Promise<string> {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const filePath = path.join(process.env.UPLOAD_DIR || './uploads/temp', `${uuidv4()}.mp4`)
    await fs.writeFile(filePath, response.data)
    return filePath
  }

  private async generateThumbnail(imagePath: string): Promise<string> {
    // In production, use sharp or ffmpeg to generate thumbnail
    // For now, return the same path
    return imagePath
  }

  private async generateThumbnailFromVideo(videoPath: string): Promise<string> {
    // In production, use ffmpeg to extract frame from video
    // For now, create a placeholder
    const thumbnailPath = videoPath.replace('.mp4', '_thumb.jpg')
    return thumbnailPath
  }

  // Mock implementations for development/testing
  private async mockGenerateImage(
    imagePath: string,
    options: GenerateImageOptions
  ): Promise<GenerationResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return {
      imagePath: imagePath.replace('.', '_generated.'),
      thumbnailPath: imagePath.replace('.', '_thumb.'),
      angle: options.angle,
    }
  }

  private async mockGenerateVideo(
    imagePath: string,
    options: GenerateVideoOptions
  ): Promise<GenerationResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    return {
      videoPath: imagePath.replace(/\.(jpg|png|webp)$/i, '_video.mp4'),
      thumbnailPath: imagePath.replace(/\.(jpg|png|webp)$/i, '_thumb.jpg'),
      angle: options.angle,
      cameraAngles: options.cameraAngles,
    }
  }
}

export const runwayMlClient = new RunwayMlClient()

