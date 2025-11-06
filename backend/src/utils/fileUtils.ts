import fs from 'fs/promises'
import path from 'path'

export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true })
  } catch (error) {
    // Directory might already exist, ignore error
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

export async function deleteFileIfExists(filePath: string): Promise<void> {
  if (await fileExists(filePath)) {
    await fs.unlink(filePath)
  }
}

export function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase()
}

export function isValidImageFile(filename: string): boolean {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp']
  return validExtensions.includes(getFileExtension(filename))
}

