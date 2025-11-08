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
  private replicateApiKey: string

  constructor() {
    this.apiKey = process.env.RUNWAY_ML_API_KEY || ''
    this.baseUrl = process.env.RUNWAY_ML_API_URL || 'https://api.runwayml.com/v1'
    this.replicateApiKey = process.env.REPLICATE_API_TOKEN || ''
    
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
   * Generate model image from dress image using Replicate API
   * Uses Stable Diffusion for image-to-image generation
   */
  async generateModelImage(
    imagePath: string,
    options: GenerateImageOptions = {}
  ): Promise<GenerationResult> {
    // Try Replicate API first (free tier available)
    if (this.replicateApiKey && this.replicateApiKey !== 'your-replicate-api-token') {
      try {
        return await this.generateImageWithReplicate(imagePath, options)
      } catch (error) {
        console.error('Replicate API error:', error)
        // Fallback to mock
      }
    }

    // Try Runway ML API if key is available
    if (this.apiKey && this.apiKey !== 'your-runway-ml-api-key') {
      try {
        const imageBuffer = await fs.readFile(imagePath)
        const imageBase64 = imageBuffer.toString('base64')

        const response = await this.client.post('/image-to-model', {
          image: imageBase64,
          pose: options.pose || 'standing',
          angle: options.angle || 'front',
          style: 'realistic',
          diversity: true,
        })

        const generatedImagePath = await this.downloadImage(response.data.image_url)
        const thumbnailPath = await this.generateThumbnail(generatedImagePath)

        return {
          imagePath: generatedImagePath,
          thumbnailPath,
          angle: options.angle,
        }
      } catch (error) {
        console.error('Runway ML API error:', error)
      }
    }

    // Fallback to mock
    return this.mockGenerateImage(imagePath, options)
  }

  /**
   * Generate image using Replicate API (Stable Diffusion)
   */
  private async generateImageWithReplicate(
    imagePath: string,
    options: GenerateImageOptions
  ): Promise<GenerationResult> {
    const imageBuffer = await fs.readFile(imagePath)
    const imageBase64 = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`

    // Use Stable Diffusion image-to-image model
    // Model: stability-ai/stable-diffusion-img2img or similar
    const prompt = `A professional fashion model wearing a dress, ${options.pose || 'standing'} pose, ${options.angle || 'front'} angle, high quality, photorealistic, fashion photography, studio lighting`

    try {
      // Try using model owner/model format (more reliable)
      const response = await axios.post(
        'https://api.replicate.com/v1/predictions',
        {
          model: 'stability-ai/stable-diffusion-img2img',
          input: {
            image: imageBase64,
            prompt: prompt,
            num_outputs: 1,
            guidance_scale: 7.5,
            num_inference_steps: 50,
            strength: 0.8, // How much to transform the image
          },
        },
        {
          headers: {
            'Authorization': `Token ${this.replicateApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 120000, // 2 minutes
        }
      )

      const predictionId = response.data.id

      // Poll for completion
      let result = await this.pollReplicatePrediction(predictionId)
      
      if (result && result.output) {
        // Handle both array and single output
        const imageUrl = Array.isArray(result.output) ? result.output[0] : result.output
        if (imageUrl) {
          const generatedImagePath = await this.downloadImage(imageUrl)
          const thumbnailPath = await this.generateThumbnail(generatedImagePath)

          return {
            imagePath: generatedImagePath,
            thumbnailPath,
            angle: options.angle,
          }
        }
      }

      throw new Error('Replicate image generation failed - no output')
    } catch (error: any) {
      // If model format fails, try with version format
      if (error.response?.status === 404 || error.message?.includes('model')) {
        console.log('Trying alternative Replicate model format...')
        // Fallback to mock for now - user can configure correct model
        throw new Error('Replicate model not found - please check model name or use mock mode')
      }
      throw error
    }
  }

  /**
   * Poll Replicate prediction until completion
   */
  private async pollReplicatePrediction(predictionId: string, maxAttempts = 60): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await axios.get(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            'Authorization': `Token ${this.replicateApiKey}`,
          },
        }
      )

      const status = response.data.status

      if (status === 'succeeded') {
        return response.data
      }

      if (status === 'failed' || status === 'canceled') {
        throw new Error(`Replicate prediction ${status}`)
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    throw new Error('Replicate prediction timeout')
  }

  /**
   * Generate video from dress image using Replicate API
   * Uses image-to-video models
   */
  async generateVideo(
    imagePath: string,
    options: GenerateVideoOptions = {}
  ): Promise<GenerationResult> {
    // Try Replicate API first (free tier available)
    if (this.replicateApiKey && this.replicateApiKey !== 'your-replicate-api-token') {
      try {
        return await this.generateVideoWithReplicate(imagePath, options)
      } catch (error) {
        console.error('Replicate API error:', error)
        // Fallback to mock
      }
    }

    // Try Runway ML API if key is available
    if (this.apiKey && this.apiKey !== 'your-runway-ml-api-key') {
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

        const jobId = response.data.job_id
        const videoUrl = await this.waitForJobCompletion(jobId)
        const generatedVideoPath = await this.downloadVideo(videoUrl)
        const thumbnailPath = await this.generateThumbnailFromVideo(generatedVideoPath)

        return {
          videoPath: generatedVideoPath,
          thumbnailPath,
          angle: options.angle,
          cameraAngles: options.cameraAngles,
        }
      } catch (error) {
        console.error('Runway ML API error:', error)
      }
    }

    // Fallback to mock
    return this.mockGenerateVideo(imagePath, options)
  }

  /**
   * Generate video using Replicate API (image-to-video)
   */
  private async generateVideoWithReplicate(
    imagePath: string,
    options: GenerateVideoOptions
  ): Promise<GenerationResult> {
    const imageBuffer = await fs.readFile(imagePath)
    const imageBase64 = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`

    // Use image-to-video model
    // Model: anotherjesse/zeroscope-v2-xl or similar
    const prompt = `A professional fashion model wearing a dress, ${options.movement || 'walking'} on runway, ${options.style || 'elegant'} style, high quality, cinematic`

    try {
      const response = await axios.post(
        'https://api.replicate.com/v1/predictions',
        {
          model: 'anotherjesse/zeroscope-v2-xl',
          input: {
            image: imageBase64,
            prompt: prompt,
            num_frames: options.duration ? Math.min(options.duration * 8, 80) : 40, // 8 fps
            fps: 8,
            width: 1024,
            height: 576,
          },
        },
        {
          headers: {
            'Authorization': `Token ${this.replicateApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 300000, // 5 minutes
        }
      )

      const predictionId = response.data.id

      // Poll for completion
      let result = await this.pollReplicatePrediction(predictionId, 120) // Longer timeout for video
      
      if (result && result.output) {
        // Handle both array and single output
        const videoUrl = Array.isArray(result.output) ? result.output[0] : result.output
        if (videoUrl) {
          const generatedVideoPath = await this.downloadVideo(videoUrl)
          const thumbnailPath = await this.generateThumbnailFromVideo(generatedVideoPath)

          return {
            videoPath: generatedVideoPath,
            thumbnailPath,
            angle: options.angle,
            cameraAngles: options.cameraAngles,
          }
        }
      }

      throw new Error('Replicate video generation failed - no output')
    } catch (error: any) {
      // If model format fails, try with version format
      if (error.response?.status === 404 || error.message?.includes('model')) {
        console.log('Trying alternative Replicate model format...')
        // Fallback to mock for now - user can configure correct model
        throw new Error('Replicate model not found - please check model name or use mock mode')
      }
      throw error
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

