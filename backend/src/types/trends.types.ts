export interface TrendFilters {
  ageGroup: '18-25' | '26-35' | '36-50' | '50+' | null
  season: 'spring' | 'summer' | 'fall' | 'winter' | null
  category: string | null
  timeRange: '30days' | '90days' | '1year'
}

export interface TrendData {
  topTrendingStyle: string
  yoyGrowth: number
  lastUpdated: string
  trendingTypes: Array<{
    name: string
    searchVolume: number
  }>
  ageDemographics: Array<{
    name: string
    value: number
  }>
  timeSeriesData: Array<{
    date: string
    [key: string]: string | number
  }>
  seasonalTrends: Array<{
    season: string
    [key: string]: string | number
  }>
  categories: string[]
  predictiveInsights?: Array<{
    title: string
    description: string
    confidence: number
  }>
  regionalPreferences?: Array<{
    region: string
    preferences: Record<string, number>
  }>
}

