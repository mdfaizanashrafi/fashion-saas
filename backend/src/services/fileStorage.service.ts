import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

class FileStorageService {
  private uploadDir: string
  private publicDir: string

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads'
    this.publicDir = process.env.PUBLIC_UPLOAD_DIR || './public/uploads'
  }

  async ensureDirectories() {
    await fs.mkdir(this.uploadDir, { recursive: true })
    await fs.mkdir(this.publicDir, { recursive: true })
    await fs.mkdir(path.join(this.uploadDir, 'temp'), { recursive: true })
    await fs.mkdir(path.join(this.publicDir, 'thumbnails'), { recursive: true })
    await fs.mkdir(path.join(this.publicDir, 'videos'), { recursive: true })
    await fs.mkdir(path.join(this.publicDir, 'images'), { recursive: true })
  }

  async saveProcessedFile(
    sourcePath: string,
    filename: string,
    type: 'image' | 'video'
  ): Promise<string> {
    const subDir = type === 'image' ? 'images' : 'videos'
    const destDir = path.join(this.publicDir, subDir)
    await fs.mkdir(destDir, { recursive: true })

    const destPath = path.join(destDir, filename)
    await fs.copyFile(sourcePath, destPath)

    return destPath
  }

  async saveThumbnail(sourcePath: string, filename: string): Promise<string> {
    const destDir = path.join(this.publicDir, 'thumbnails')
    await fs.mkdir(destDir, { recursive: true })

    const destPath = path.join(destDir, filename)
    await fs.copyFile(sourcePath, destPath)

    return destPath
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath)
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error)
    }
  }

  getPublicUrl(filePath: string): string {
    const relativePath = path.relative(this.publicDir, filePath)
    return `/uploads/${relativePath.replace(/\\/g, '/')}`
  }
}

export const fileStorageService = new FileStorageService()

