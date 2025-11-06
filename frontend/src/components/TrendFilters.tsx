import type { TrendFilters } from '../types'

interface TrendFiltersProps {
  filters: TrendFilters
  onFiltersChange: (filters: TrendFilters) => void
}

export default function TrendFilters({ filters, onFiltersChange }: TrendFiltersProps) {
  const updateFilter = <K extends keyof TrendFilters>(key: K, value: TrendFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className="card">
      <h3 className="font-semibold text-neutral-900 mb-4">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Age Group
          </label>
          <select
            value={filters.ageGroup || ''}
            onChange={(e) => updateFilter('ageGroup', (e.target.value ? (e.target.value as TrendFilters['ageGroup']) : null))}
            className="input-field"
          >
            <option value="">All Ages</option>
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36-50">36-50</option>
            <option value="50+">50+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Season
          </label>
          <select
            value={filters.season || ''}
            onChange={(e) => updateFilter('season', (e.target.value ? (e.target.value as TrendFilters['season']) : null))}
            className="input-field"
          >
            <option value="">All Seasons</option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="fall">Fall</option>
            <option value="winter">Winter</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => updateFilter('category', (e.target.value ? (e.target.value as TrendFilters['category']) : null))}
            className="input-field"
          >
            <option value="">All Categories</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="party">Party</option>
            <option value="wedding">Wedding</option>
            <option value="maxi">Maxi</option>
            <option value="mini">Mini</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Time Range
          </label>
          <select
            value={filters.timeRange}
            onChange={(e) => updateFilter('timeRange', e.target.value as '30days' | '90days' | '1year')}
            className="input-field"
          >
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>
    </div>
  )
}


