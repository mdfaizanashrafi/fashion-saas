import { CatalogueItem } from '../types/catalogue.types'
import { runwayMlClient } from '../clients/runwayMl.client'
import { fileStorageService } from './fileStorage.service'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

interface ProcessedFile {
  filename: string
  originalname: string
  path: string
}

class AiVideoService {
  async generateCatalogueContent(file: ProcessedFile): Promise<CatalogueItem[]> {
    const items: CatalogueItem[] = []
    const baseName = path.parse(file.originalname).name

    try {
      // Generate 3-5 model pictures
      const pictures = await this.generateModelPictures(file, baseName)
      items.push(...pictures)

      // Generate 15-second clips
      const clips = await this.generateShortClips(file, baseName)
      items.push(...clips)

      // Generate 30-second runway videos
      const videos = await this.generateRunwayVideos(file, baseName)
      items.push(...videos)

      return items
    } catch (error) {
      console.error('Error generating catalogue content:', error)
      throw error
    }
  }

  private async generateModelPictures(
    file: ProcessedFile,
    baseName: string
  ): Promise<CatalogueItem[]> {
    const pictures: CatalogueItem[] = []
    const count = Math.floor(Math.random() * 3) + 3 // 3-5 pictures

    for (let i = 0; i < count; i++) {
      const itemId = uuidv4()
      
      try {
        // Call Runway ML API for image-to-image generation
        const result = await runwayMlClient.generateModelImage(file.path, {
          pose: this.getRandomPose(),
          angle: this.getRandomAngle(),
        })

        // Ensure required fields are present
        if (!result.thumbnailPath || !result.imagePath) {
          throw new Error('Missing image paths from Runway ML result')
        }

        // Save thumbnail
        const thumbnailPath = await fileStorageService.saveThumbnail(
          result.thumbnailPath,
          `${itemId}_thumb.jpg`
        )

        // Save full image
        const imagePath = await fileStorageService.saveProcessedFile(
          result.imagePath,
          `${itemId}.jpg`,
          'image'
        )

        pictures.push({
          id: itemId,
          title: `${baseName} - Model Pose ${i + 1}`,
          type: 'pictures',
          thumbnailUrl: fileStorageService.getPublicUrl(thumbnailPath),
          downloadUrl: fileStorageService.getPublicUrl(imagePath),
          metadata: {
            marketAppeal: Math.floor(Math.random() * 30) + 70, // 70-100
            styleTags: this.generateStyleTags(),
            bodyDiversity: this.getRandomBodyType(),
            angles: [result.angle ?? this.getRandomAngle()],
          },
          createdAt: new Date().toISOString(),
        })
      } catch (error) {
        console.error(`Error generating picture ${i + 1}:`, error)
      }
    }

    return pictures
  }

  private async generateShortClips(
    file: ProcessedFile,
    baseName: string
  ): Promise<CatalogueItem[]> {
    const clips: CatalogueItem[] = []
    const count = 2 // Generate 2 short clips

    for (let i = 0; i < count; i++) {
      const itemId = uuidv4()
      
      try {
        // Call Runway ML API for image-to-video (15 seconds)
        const result = await runwayMlClient.generateVideo(file.path, {
          duration: 15,
          angle: this.getRandomAngle(),
          movement: this.getRandomMovement(),
        })

        if (!result.thumbnailPath || !result.videoPath) {
          throw new Error('Missing video paths from Runway ML result')
        }

        // Save thumbnail
        const thumbnailPath = await fileStorageService.saveThumbnail(
          result.thumbnailPath,
          `${itemId}_thumb.jpg`
        )

        // Save video
        const videoPath = await fileStorageService.saveProcessedFile(
          result.videoPath,
          `${itemId}.mp4`,
          'video'
        )

        clips.push({
          id: itemId,
          title: `${baseName} - 15s Clip ${i + 1}`,
          type: 'clips',
          thumbnailUrl: fileStorageService.getPublicUrl(thumbnailPath),
          downloadUrl: fileStorageService.getPublicUrl(videoPath),
          metadata: {
            marketAppeal: Math.floor(Math.random() * 30) + 70,
            styleTags: this.generateStyleTags(),
            bodyDiversity: this.getRandomBodyType(),
            angles: [result.angle ?? this.getRandomAngle()],
            duration: 15,
          },
          createdAt: new Date().toISOString(),
        })
      } catch (error) {
        console.error(`Error generating clip ${i + 1}:`, error)
      }
    }

    return clips
  }

  private async generateRunwayVideos(
    file: ProcessedFile,
    baseName: string
  ): Promise<CatalogueItem[]> {
    const videos: CatalogueItem[] = []
    const count = 1 // Generate 1 runway video

    const itemId = uuidv4()
    
    try {
      // Call Runway ML API for runway-style video (30 seconds)
      const result = await runwayMlClient.generateVideo(file.path, {
        duration: 30,
        style: 'runway',
        cameraAngles: ['front', 'side', 'back', 'close-up'],
        walking: true,
      })

      if (!result.thumbnailPath || !result.videoPath) {
        throw new Error('Missing video paths from Runway ML result')
      }

      // Save thumbnail
      const thumbnailPath = await fileStorageService.saveThumbnail(
        result.thumbnailPath,
        `${itemId}_thumb.jpg`
      )

      // Save video
      const videoPath = await fileStorageService.saveProcessedFile(
        result.videoPath,
        `${itemId}.mp4`,
        'video'
      )

      videos.push({
        id: itemId,
        title: `${baseName} - Runway Video`,
        type: 'videos',
        thumbnailUrl: fileStorageService.getPublicUrl(thumbnailPath),
        downloadUrl: fileStorageService.getPublicUrl(videoPath),
        metadata: {
          marketAppeal: Math.floor(Math.random() * 20) + 80, // 80-100 for runway
          styleTags: this.generateStyleTags(),
          bodyDiversity: this.getRandomBodyType(),
          angles: result.cameraAngles || [],
          duration: 30,
        },
        createdAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error generating runway video:', error)
    }

    return videos
  }

  private getRandomPose(): string {
    const poses = ['standing', 'walking', 'sitting', 'twirling', 'striking-pose']
    return poses[Math.floor(Math.random() * poses.length)]
  }

  private getRandomAngle(): string {
    const angles = ['front', 'side', 'back', 'three-quarter', 'close-up']
    return angles[Math.floor(Math.random() * angles.length)]
  }

  private getRandomMovement(): string {
    const movements = ['slow-walk', 'twirl', 'pose-change', 'camera-pan']
    return movements[Math.floor(Math.random() * movements.length)]
  }

  private generateStyleTags(): string[] {
    const allTags = ['elegant', 'casual', 'formal', 'vintage', 'modern', 'floral', 'minimalist', 'bold']
    const count = Math.floor(Math.random() * 3) + 2 // 2-4 tags
    const selected = new Set<string>()
    
    while (selected.size < count) {
      selected.add(allTags[Math.floor(Math.random() * allTags.length)])
    }
    
    return Array.from(selected)
  }

  private getRandomBodyType(): string {
    const types = ['diverse', 'petite', 'curvy', 'tall', 'standard']
    return types[Math.floor(Math.random() * types.length)]
  }
}

export const aiVideoService = new AiVideoService()

