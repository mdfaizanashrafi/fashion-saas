import { useState, useEffect } from 'react'
import TrendDashboard from '../components/TrendDashboard'
import TrendFilters from '../components/TrendFilters'
import { TrendData, TrendFilters as TrendFiltersType } from '../types'
import { api } from '../services/api'

export default function TrendAnalyzer() {
  const [trendData, setTrendData] = useState<TrendData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TrendFiltersType>({
    ageGroup: null,
    season: null,
    category: null,
    timeRange: '30days',
  })

  useEffect(() => {
    fetchTrendData()
  }, [filters])

  const fetchTrendData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getTrends(filters)
      setTrendData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trend data')
      // Show cached data if available
      const cached = localStorage.getItem('trendDataCache')
      if (cached) {
        const parsed = JSON.parse(cached)
        setTrendData(parsed.data)
        setError('Using cached data. Latest data unavailable.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Trend Analyzer</h1>
        <p className="text-neutral-600 mt-2">
          Real-time trend analytics segmented by demographics, seasons, and categories
        </p>
      </div>

      <TrendFilters filters={filters} onFiltersChange={setFilters} />

      {loading && !trendData && (
        <div className="card animate-pulse">
          <div className="h-64 bg-neutral-200 rounded"></div>
        </div>
      )}

      {error && (
        <div className="card bg-yellow-50 border-yellow-200">
          <p className="text-yellow-800">{error}</p>
          {trendData && (
            <p className="text-sm text-yellow-600 mt-2">
              Last updated: {new Date(trendData.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {trendData && <TrendDashboard data={trendData} />}
    </div>
  )
}


