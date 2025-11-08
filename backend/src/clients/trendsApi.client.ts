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

  // Enhanced mock implementations with realistic data patterns
  private mockFetchTrendData(filters: TrendFilters): TrendData {
    const now = new Date()
    const categories = ['Maxi Dress', 'Mini Dress', 'Casual Dress', 'Formal Dress', 'Party Dress', 'Wedding Dress', 'Cocktail Dress', 'Evening Dress']
    
    // Get current season
    const currentMonth = now.getMonth()
    const currentSeason = currentMonth >= 2 && currentMonth <= 4 ? 'spring' :
                          currentMonth >= 5 && currentMonth <= 7 ? 'summer' :
                          currentMonth >= 8 && currentMonth <= 10 ? 'fall' : 'winter'
    
    // Use filter season or current season
    const season = filters.season || currentSeason
    
    // Generate realistic time series data with trends
    const timeSeriesData = []
    const days = filters.timeRange === '30days' ? 30 : filters.timeRange === '90days' ? 90 : 365
    
    // Base volumes for each category (realistic search volumes)
    const baseVolumes: Record<string, number> = {
      'Maxi Dress': 8500,
      'Mini Dress': 7200,
      'Casual Dress': 6800,
      'Formal Dress': 5400,
      'Party Dress': 4900,
      'Wedding Dress': 3800,
      'Cocktail Dress': 4200,
      'Evening Dress': 3600,
    }
    
    // Seasonal multipliers
    const seasonalMultipliers: Record<string, Record<string, number>> = {
      spring: { 'Maxi Dress': 1.1, 'Mini Dress': 0.9, 'Casual Dress': 1.2, 'Formal Dress': 0.95 },
      summer: { 'Maxi Dress': 1.3, 'Mini Dress': 1.4, 'Casual Dress': 1.3, 'Formal Dress': 0.8 },
      fall: { 'Maxi Dress': 1.0, 'Mini Dress': 0.7, 'Casual Dress': 1.1, 'Formal Dress': 1.1 },
      winter: { 'Maxi Dress': 1.2, 'Mini Dress': 0.5, 'Casual Dress': 1.0, 'Formal Dress': 1.3 },
    }
    
    const multipliers = seasonalMultipliers[season] || {}
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      const point: any = {
        date: date.toISOString().split('T')[0],
      }
      
      // Add realistic variation with weekly patterns (higher on weekends)
      const dayOfWeek = date.getDay()
      const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.15 : 1.0
      
      categories.forEach(cat => {
        const base = baseVolumes[cat] || 5000
        const seasonalMult = multipliers[cat] || 1.0
        const trend = 1 + (Math.sin(i / 7) * 0.1) // Weekly trend
        const random = 0.9 + Math.random() * 0.2 // Random variation
        
        point[cat] = Math.floor(base * seasonalMult * trend * random * weekendMultiplier)
      })
      
      timeSeriesData.push(point)
    }

    // Age demographics with realistic distribution
    const ageDemographics = [
      { 
        name: '18-25', 
        value: filters.ageGroup === '18-25' ? 45 : 
               filters.ageGroup ? 15 : 
               Math.floor(30 + Math.random() * 10) 
      },
      { 
        name: '26-35', 
        value: filters.ageGroup === '26-35' ? 45 : 
               filters.ageGroup ? 15 : 
               Math.floor(35 + Math.random() * 10) 
      },
      { 
        name: '36-50', 
        value: filters.ageGroup === '36-50' ? 45 : 
               filters.ageGroup ? 15 : 
               Math.floor(25 + Math.random() * 10) 
      },
      { 
        name: '50+', 
        value: filters.ageGroup === '50+' ? 45 : 
               filters.ageGroup ? 15 : 
               Math.floor(10 + Math.random() * 5) 
      },
    ]

    // Normalize to 100%
    const total = ageDemographics.reduce((sum, d) => sum + d.value, 0)
    ageDemographics.forEach(d => d.value = Math.round((d.value / total) * 100))

    // Trending types with realistic search volumes
    const trendingTypes = categories.map(cat => {
      const base = baseVolumes[cat] || 5000
      const seasonalMult = multipliers[cat] || 1.0
      return {
        name: cat,
        searchVolume: Math.floor(base * seasonalMult * (0.9 + Math.random() * 0.2))
      }
    }).sort((a, b) => b.searchVolume - a.searchVolume)

    // Seasonal trends with realistic data
    const seasonalTrends = [
      {
        season: 'Spring',
        'Maxi Dress': Math.floor(baseVolumes['Maxi Dress'] * 1.1),
        'Mini Dress': Math.floor(baseVolumes['Mini Dress'] * 0.9),
        'Casual Dress': Math.floor(baseVolumes['Casual Dress'] * 1.2),
        'Formal Dress': Math.floor(baseVolumes['Formal Dress'] * 0.95),
        'Party Dress': Math.floor(baseVolumes['Party Dress'] * 1.0),
      },
      {
        season: 'Summer',
        'Maxi Dress': Math.floor(baseVolumes['Maxi Dress'] * 1.3),
        'Mini Dress': Math.floor(baseVolumes['Mini Dress'] * 1.4),
        'Casual Dress': Math.floor(baseVolumes['Casual Dress'] * 1.3),
        'Formal Dress': Math.floor(baseVolumes['Formal Dress'] * 0.8),
        'Party Dress': Math.floor(baseVolumes['Party Dress'] * 1.2),
      },
      {
        season: 'Fall',
        'Maxi Dress': Math.floor(baseVolumes['Maxi Dress'] * 1.0),
        'Mini Dress': Math.floor(baseVolumes['Mini Dress'] * 0.7),
        'Casual Dress': Math.floor(baseVolumes['Casual Dress'] * 1.1),
        'Formal Dress': Math.floor(baseVolumes['Formal Dress'] * 1.1),
        'Party Dress': Math.floor(baseVolumes['Party Dress'] * 0.9),
      },
      {
        season: 'Winter',
        'Maxi Dress': Math.floor(baseVolumes['Maxi Dress'] * 1.2),
        'Mini Dress': Math.floor(baseVolumes['Mini Dress'] * 0.5),
        'Casual Dress': Math.floor(baseVolumes['Casual Dress'] * 1.0),
        'Formal Dress': Math.floor(baseVolumes['Formal Dress'] * 1.3),
        'Party Dress': Math.floor(baseVolumes['Party Dress'] * 1.1),
      },
    ]

    // Top trending style based on current season
    const topTrendingStyle = trendingTypes[0].name
    
    // Calculate YoY growth (realistic range)
    const yoyGrowth = 12.5 + (Math.random() * 8) // 12.5% to 20.5%

    // Predictive insights based on current trends
    const predictiveInsights = [
      {
        title: 'Rising Trend: Sustainable Materials',
        description: `Dresses with eco-friendly materials showing ${Math.floor(20 + Math.random() * 10)}% increase in search volume`,
        confidence: 80 + Math.floor(Math.random() * 15),
      },
      {
        title: `Seasonal Shift: ${season.charAt(0).toUpperCase() + season.slice(1)} Trends`,
        description: `${topTrendingStyle} showing strong growth for ${season} season with increased interest in ${filters.ageGroup || 'all demographics'}`,
        confidence: 75 + Math.floor(Math.random() * 20),
      },
      {
        title: 'Demographic Shift: 26-35 Age Group',
        description: 'Increased interest in formal and business-casual dresses among 26-35 demographic',
        confidence: 70 + Math.floor(Math.random() * 15),
      },
    ]

    return {
      topTrendingStyle,
      yoyGrowth: Math.round(yoyGrowth * 10) / 10,
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

