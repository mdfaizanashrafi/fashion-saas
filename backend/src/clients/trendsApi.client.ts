import axios, { AxiosInstance } from 'axios'
import { TrendData, TrendFilters } from '../types/trends.types'

class TrendsApiClient {
  private client: AxiosInstance
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.TRENDS_API_KEY || ''
    this.baseUrl = process.env.TRENDS_API_URL || 'https://trends.googleapis.com/v1beta'
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })
  }

  /**
   * Fetch trend data with filters
   * In production, this would call Google Trends API or similar
   */
  async fetchTrendData(filters: TrendFilters): Promise<TrendData> {
    // Mock implementation - replace with actual API call
    if (!this.apiKey || this.apiKey === 'your-trends-api-key') {
      return this.mockFetchTrendData(filters)
    }

    try {
      const response = await this.client.get('/trends', {
        params: {
          category: 'fashion',
          filters: JSON.stringify(filters),
          time_range: filters.timeRange || '30days',
        },
      })

      return this.transformApiResponse(response.data, filters)
    } catch (error) {
      console.error('Trends API error:', error)
      // Fallback to mock
      return this.mockFetchTrendData(filters)
    }
  }

  /**
   * Fetch detailed trend information
   */
  async fetchTrendDetails(trendId: string): Promise<TrendData | null> {
    if (!this.apiKey || this.apiKey === 'your-trends-api-key') {
      return this.mockFetchTrendDetails(trendId)
    }

    try {
      const response = await this.client.get(`/trends/${trendId}`)
      return this.transformApiResponse(response.data, {
        ageGroup: null,
        season: null,
        category: null,
        timeRange: '30days',
      })
    } catch (error) {
      console.error('Trends API error:', error)
      return null
    }
  }

  private transformApiResponse(apiData: any, filters: TrendFilters): TrendData {
    // Transform API response to our TrendData format
    return {
      topTrendingStyle: apiData.top_trend || 'Maxi Dress',
      yoyGrowth: apiData.yoy_growth || 15.5,
      lastUpdated: new Date().toISOString(),
      trendingTypes: apiData.trending_types || [],
      ageDemographics: apiData.age_demographics || [],
      timeSeriesData: apiData.time_series || [],
      seasonalTrends: apiData.seasonal_trends || [],
      categories: apiData.categories || [],
      predictiveInsights: apiData.insights || [],
      regionalPreferences: apiData.regional || [],
    }
  }

  // Mock implementations for development/testing
  private mockFetchTrendData(filters: TrendFilters): TrendData {
    const now = new Date()
    const categories = ['Maxi Dress', 'Mini Dress', 'Casual Dress', 'Formal Dress', 'Party Dress']
    
    // Generate time series data
    const timeSeriesData = []
    const days = filters.timeRange === '30days' ? 30 : filters.timeRange === '90days' ? 90 : 365
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      const point: any = {
        date: date.toISOString().split('T')[0],
      }
      
      categories.forEach(cat => {
        point[cat] = Math.floor(Math.random() * 100) + 50
      })
      
      timeSeriesData.push(point)
    }

    // Age demographics
    const ageDemographics = [
      { name: '18-25', value: filters.ageGroup === '18-25' ? 45 : 30 },
      { name: '26-35', value: filters.ageGroup === '26-35' ? 45 : 35 },
      { name: '36-50', value: filters.ageGroup === '36-50' ? 45 : 25 },
      { name: '50+', value: filters.ageGroup === '50+' ? 45 : 10 },
    ]

    // Trending types
    const trendingTypes = [
      { name: 'Maxi Dress', searchVolume: 8500 },
      { name: 'Mini Dress', searchVolume: 7200 },
      { name: 'Casual Dress', searchVolume: 6800 },
      { name: 'Formal Dress', searchVolume: 5400 },
      { name: 'Party Dress', searchVolume: 4900 },
      { name: 'Wedding Dress', searchVolume: 3800 },
    ]

    // Seasonal trends
    const seasonalTrends = [
      {
        season: 'Spring',
        'Maxi Dress': 7500,
        'Mini Dress': 6500,
        'Casual Dress': 8000,
      },
      {
        season: 'Summer',
        'Maxi Dress': 9500,
        'Mini Dress': 9200,
        'Casual Dress': 8800,
      },
      {
        season: 'Fall',
        'Maxi Dress': 7800,
        'Mini Dress': 5500,
        'Casual Dress': 7200,
      },
      {
        season: 'Winter',
        'Maxi Dress': 8200,
        'Mini Dress': 4200,
        'Casual Dress': 6900,
      },
    ]

    // Predictive insights
    const predictiveInsights = [
      {
        title: 'Rising Trend: Sustainable Materials',
        description: 'Dresses with eco-friendly materials showing 25% increase in search volume',
        confidence: 85,
      },
      {
        title: 'Demographic Shift: 26-35 Age Group',
        description: 'Increased interest in formal and business-casual dresses among 26-35 demographic',
        confidence: 78,
      },
    ]

    return {
      topTrendingStyle: 'Maxi Dress',
      yoyGrowth: 15.5,
      lastUpdated: now.toISOString(),
      trendingTypes,
      ageDemographics,
      timeSeriesData,
      seasonalTrends,
      categories,
      predictiveInsights,
    }
  }

  private mockFetchTrendDetails(trendId: string): TrendData | null {
    // Return detailed mock data for a specific trend
    return this.mockFetchTrendData({
      ageGroup: null,
      season: null,
      category: null,
      timeRange: '30days',
    })
  }
}

export const trendsApiClient = new TrendsApiClient()

