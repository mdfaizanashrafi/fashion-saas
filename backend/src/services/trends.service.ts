import { TrendData, TrendFilters } from '../types/trends.types'
import { trendsApiClient } from '../clients/trendsApi.client'
import { cacheService } from './cache.service'

class TrendsService {
  async getTrendData(filters: TrendFilters): Promise<TrendData> {
    const cacheKey = `trends:${JSON.stringify(filters)}`
    
    // Try to get from cache first
    const cached = await cacheService.get(cacheKey)
    if (cached) {
      return cached as TrendData
    }

    // Fetch from API
    const trendData = await trendsApiClient.fetchTrendData(filters)

    // Cache for 1 hour
    await cacheService.set(cacheKey, trendData, 3600)

    return trendData
  }

  async getTrendDetails(trendId: string): Promise<TrendData | null> {
    const cacheKey = `trend:details:${trendId}`
    
    const cached = await cacheService.get(cacheKey)
    if (cached) {
      return cached as TrendData
    }

    const details = await trendsApiClient.fetchTrendDetails(trendId)
    
    if (details) {
      await cacheService.set(cacheKey, details, 3600)
    }

    return details
  }

  async getCategories(): Promise<string[]> {
    return [
      'casual',
      'formal',
      'party',
      'wedding',
      'maxi',
      'mini',
      'cocktail',
      'bridesmaid',
      'evening',
      'day-dress',
    ]
  }
}

export const trendsService = new TrendsService()

