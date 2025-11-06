import axios from 'axios'
import { TrendData, TrendFilters, CatalogueItem, ApiError } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const apiError: ApiError = {
        message: error.response.data?.message || 'An error occurred',
        code: error.response.data?.code,
        details: error.response.data,
      }
      return Promise.reject(apiError)
    }
    return Promise.reject(error)
  }
)

export const api = {
  // Catalogue endpoints
  async generateCatalogue(files: File[]): Promise<{ items: CatalogueItem[] }> {
    const formData = new FormData()
    files.forEach(file => formData.append('images', file))

    const response = await apiClient.post('/catalogue/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutes for video generation
    })

    return response.data
  },

  async getCatalogueStatus(jobId: string): Promise<{ status: string; items?: CatalogueItem[] }> {
    const response = await apiClient.get(`/catalogue/status/${jobId}`)
    return response.data
  },

  async downloadCatalogueItem(itemId: string): Promise<Blob> {
    const response = await apiClient.get(`/catalogue/download/${itemId}`, {
      responseType: 'blob',
    })
    return response.data
  },

  // Trend endpoints
  async getTrends(filters: TrendFilters): Promise<TrendData> {
    const response = await apiClient.get('/trends', { params: filters })
    const data = response.data
    
    // Cache the data
    localStorage.setItem('trendDataCache', JSON.stringify({
      data,
      timestamp: Date.now(),
    }))
    
    return data
  },

  async getTrendDetails(trendId: string): Promise<TrendData> {
    const response = await apiClient.get(`/trends/${trendId}`)
    return response.data
  },
}

export { apiClient }


