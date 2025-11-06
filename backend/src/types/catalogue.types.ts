export interface CatalogueItem {
  id: string
  title: string
  type: 'pictures' | 'clips' | 'videos'
  thumbnailUrl: string
  downloadUrl: string
  metadata: {
    marketAppeal: number
    styleTags: string[]
    bodyDiversity?: string
    angles?: string[]
    duration?: number
  }
  createdAt: string
}

export interface JobStatus {
  jobId: string
  status: 'processing' | 'completed' | 'failed' | 'cancelled'
  progress: number
  items: CatalogueItem[]
  error: string | null
  createdAt: Date
  updatedAt: Date
}

