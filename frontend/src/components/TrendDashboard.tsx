import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, Calendar } from 'lucide-react'
import { TrendData } from '../types'

interface TrendDashboardProps {
  data: TrendData
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']

export default function TrendDashboard({ data }: TrendDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Top Trending Style</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">
                {data.topTrendingStyle}
              </p>
            </div>
            <TrendingUp size={32} className="text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Year-over-Year Growth</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">
                {data.yoyGrowth > 0 ? '+' : ''}{data.yoyGrowth}%
              </p>
            </div>
            <Users size={32} className="text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Last Updated</p>
              <p className="text-sm font-medium text-neutral-900 mt-1">
                {new Date(data.lastUpdated).toLocaleString()}
              </p>
            </div>
            <Calendar size={32} className="text-primary-600" />
          </div>
        </div>
      </div>

      {/* Trending Dress Types */}
      <div className="card">
        <h3 className="text-xl font-bold text-neutral-900 mb-6">
          Trending Dress Types (Search Volume)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.trendingTypes}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="name" stroke="#737373" />
            <YAxis stroke="#737373" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="searchVolume" fill="#ef4444" name="Search Volume" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Age Demographic Breakdown */}
      <div className="card">
        <h3 className="text-xl font-bold text-neutral-900 mb-6">
          Age Demographic Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.ageDemographics}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.ageDemographics.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Time Series Trends */}
      <div className="card">
        <h3 className="text-xl font-bold text-neutral-900 mb-6">
          Trend Velocity (Last {data.timeSeriesData.length <= 31 ? '30' : data.timeSeriesData.length <= 91 ? '90' : '365'} Days)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="date" stroke="#737373" />
            <YAxis stroke="#737373" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
              }}
            />
            <Legend />
            {data.categories.map((category, index) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Seasonal Trends */}
      <div className="card">
        <h3 className="text-xl font-bold text-neutral-900 mb-6">
          Seasonal Trend Patterns
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.seasonalTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="season" stroke="#737373" />
            <YAxis stroke="#737373" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
              }}
            />
            <Legend />
            {data.categories.map((category, index) => (
              <Bar
                key={category}
                dataKey={category}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Predictive Insights */}
      {data.predictiveInsights && data.predictiveInsights.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-neutral-900 mb-6">
            Predictive Insights
          </h3>
          <div className="space-y-3">
            {data.predictiveInsights.map((insight, index) => (
              <div
                key={index}
                className="p-4 bg-primary-50 border border-primary-200 rounded-lg"
              >
                <p className="font-medium text-primary-900">{insight.title}</p>
                <p className="text-sm text-primary-700 mt-1">{insight.description}</p>
                <p className="text-xs text-primary-600 mt-2">
                  Confidence: {insight.confidence}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


