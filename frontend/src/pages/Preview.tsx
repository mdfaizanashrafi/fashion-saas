import { useState } from 'react'
import { Sparkles, TrendingUp, Upload, BarChart3, Download, Play, Image as ImageIcon, Video } from 'lucide-react'

export default function Preview() {
  const [activeTab, setActiveTab] = useState<'catalogue' | 'trends'>('catalogue')

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">FashionB2B SaaS</h1>
              <p className="text-neutral-600 mt-1">AI Model Catalogue Generator & Trend Analyzer</p>
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary">Demo Account</button>
              <button className="btn-primary">Sign Up</button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-neutral-900 mb-4">
            Transform Dress Designs into AI Model Showcases
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
            Upload dress images and generate realistic 3D model showcases with videos. 
            Get real-time trend analytics to make data-driven purchasing decisions.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="btn-primary text-lg px-8 py-4">Start Free Trial</button>
            <button className="btn-secondary text-lg px-8 py-4">Watch Demo</button>
          </div>
        </div>

        {/* Feature Tabs */}
        <div className="mb-12">
          <div className="flex gap-4 justify-center border-b border-neutral-200">
            <button
              onClick={() => setActiveTab('catalogue')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'catalogue'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Sparkles size={20} className="inline mr-2" />
              Catalogue Generator
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'trends'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <TrendingUp size={20} className="inline mr-2" />
              Trend Analyzer
            </button>
          </div>
        </div>

        {/* Catalogue Generator Preview */}
        {activeTab === 'catalogue' && (
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="card">
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                <Upload className="inline mr-2" size={24} />
                Drag & Drop Image Upload
              </h3>
              <div className="border-2 border-dashed border-neutral-300 rounded-xl p-16 text-center bg-neutral-50">
                <Upload size={64} className="mx-auto text-neutral-400 mb-4" />
                <p className="text-lg font-medium text-neutral-700 mb-2">
                  Drop dress images here or click to browse
                </p>
                <p className="text-sm text-neutral-500">
                  Supports PNG, JPG, WebP • Max 50MB per file • Batch upload supported
                </p>
              </div>
            </div>

            {/* Generated Catalogue Preview */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-neutral-900">
                  Generated Catalogue
                </h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium">
                    All (12)
                  </button>
                  <button className="px-4 py-2 bg-white text-neutral-700 border border-neutral-300 rounded-lg font-medium">
                    Pictures (5)
                  </button>
                  <button className="px-4 py-2 bg-white text-neutral-700 border border-neutral-300 rounded-lg font-medium">
                    15s Clips (4)
                  </button>
                  <button className="px-4 py-2 bg-white text-neutral-700 border border-neutral-300 rounded-lg font-medium">
                    Runway (3)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sample Catalogue Items */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="group">
                    <div className="relative aspect-[3/4] bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {i % 2 === 0 ? (
                          <Video size={48} className="text-primary-600" />
                        ) : (
                          <ImageIcon size={48} className="text-primary-600" />
                        )}
                      </div>
                      {i % 2 === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <Play size={48} className="text-white" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        {i % 2 === 0 ? (
                          <Video size={20} className="text-white drop-shadow" />
                        ) : (
                          <ImageIcon size={20} className="text-white drop-shadow" />
                        )}
                      </div>
                    </div>
                    <h4 className="font-semibold text-neutral-900 mb-2">
                      Summer Maxi Dress - Model Pose {i}
                    </h4>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <span className="font-medium">Market Appeal:</span>
                        <span className="text-primary-600 font-semibold">{85 + i * 2}%</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['elegant', 'casual', 'modern'].map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="w-full btn-secondary">
                      <Download size={18} className="mr-2 inline" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="text-primary-600" size={32} />
                </div>
                <h4 className="font-bold text-neutral-900 mb-2">AI Model Generation</h4>
                <p className="text-neutral-600 text-sm">
                  3-5 realistic 3D model images in different poses and angles
                </p>
              </div>
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="text-primary-600" size={32} />
                </div>
                <h4 className="font-bold text-neutral-900 mb-2">Video Showcases</h4>
                <p className="text-neutral-600 text-sm">
                  15-second clips and 30-second runway-style videos from multiple angles
                </p>
              </div>
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="text-primary-600" size={32} />
                </div>
                <h4 className="font-bold text-neutral-900 mb-2">Bulk Export</h4>
                <p className="text-neutral-600 text-sm">
                  Download all catalogue items as a ZIP file for multi-channel use
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Trend Analyzer Preview */}
        {activeTab === 'trends' && (
          <div className="space-y-8">
            {/* Filters */}
            <div className="card">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">
                <BarChart3 className="inline mr-2" size={24} />
                Trend Filters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Age Group
                  </label>
                  <select className="input-field">
                    <option>All Ages</option>
                    <option>18-25</option>
                    <option>26-35</option>
                    <option>36-50</option>
                    <option>50+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Season
                  </label>
                  <select className="input-field">
                    <option>All Seasons</option>
                    <option>Spring</option>
                    <option>Summer</option>
                    <option>Fall</option>
                    <option>Winter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category
                  </label>
                  <select className="input-field">
                    <option>All Categories</option>
                    <option>Casual</option>
                    <option>Formal</option>
                    <option>Party</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Time Range
                  </label>
                  <select className="input-field">
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                    <option>Last Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Top Trending Style</p>
                    <p className="text-2xl font-bold text-neutral-900 mt-1">Maxi Dress</p>
                  </div>
                  <TrendingUp size={32} className="text-primary-600" />
                </div>
              </div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Year-over-Year Growth</p>
                    <p className="text-2xl font-bold text-neutral-900 mt-1">+15.5%</p>
                  </div>
                  <BarChart3 size={32} className="text-primary-600" />
                </div>
              </div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Last Updated</p>
                    <p className="text-sm font-medium text-neutral-900 mt-1">
                      {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h4 className="text-lg font-bold text-neutral-900 mb-4">
                  Trending Dress Types
                </h4>
                <div className="h-64 bg-gradient-to-t from-primary-50 to-transparent rounded-lg flex items-end justify-around p-4">
                  {[85, 72, 68, 54, 49].map((height, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className="w-12 bg-primary-600 rounded-t transition-all hover:bg-primary-700"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-neutral-600 mt-2">{['Maxi', 'Mini', 'Casual', 'Formal', 'Party'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h4 className="text-lg font-bold text-neutral-900 mb-4">
                  Age Demographics
                </h4>
                <div className="h-64 flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 rounded-full border-8 border-primary-600" />
                    <div className="absolute inset-0 rounded-full border-8 border-primary-400 border-t-transparent rotate-90" />
                    <div className="absolute inset-0 rounded-full border-8 border-primary-300 border-t-transparent border-r-transparent rotate-180" />
                    <div className="absolute inset-0 rounded-full border-8 border-primary-200 border-t-transparent border-r-transparent border-b-transparent rotate-270" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-neutral-900">100%</p>
                        <p className="text-xs text-neutral-600">Total</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {['18-25: 30%', '26-35: 35%', '36-50: 25%', '50+: 10%'].map((label) => (
                    <div key={label} className="text-sm text-neutral-600">
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Series Preview */}
            <div className="card">
              <h4 className="text-lg font-bold text-neutral-900 mb-4">
                Trend Velocity (Last 30 Days)
              </h4>
              <div className="h-64 bg-gradient-to-t from-primary-50 to-transparent rounded-lg p-4">
                <div className="h-full flex items-end gap-1">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-primary-600 rounded-t transition-all hover:bg-primary-700 opacity-80"
                      style={{ height: `${Math.random() * 60 + 40}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Predictive Insights */}
            <div className="card">
              <h4 className="text-lg font-bold text-neutral-900 mb-4">
                Predictive Insights
              </h4>
              <div className="space-y-3">
                <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                  <p className="font-medium text-primary-900">
                    Rising Trend: Sustainable Materials
                  </p>
                  <p className="text-sm text-primary-700 mt-1">
                    Dresses with eco-friendly materials showing 25% increase in search volume
                  </p>
                  <p className="text-xs text-primary-600 mt-2">Confidence: 85%</p>
                </div>
                <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                  <p className="font-medium text-primary-900">
                    Demographic Shift: 26-35 Age Group
                  </p>
                  <p className="text-sm text-primary-700 mt-1">
                    Increased interest in formal and business-casual dresses among 26-35 demographic
                  </p>
                  <p className="text-xs text-primary-600 mt-2">Confidence: 78%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200 text-center py-12">
          <h3 className="text-3xl font-bold text-neutral-900 mb-4">
            Ready to Transform Your Fashion Catalogue?
          </h3>
          <p className="text-lg text-neutral-700 mb-8 max-w-2xl mx-auto">
            Join fashion retailers and bulk buyers who are using AI to create stunning model showcases 
            and make data-driven decisions.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="btn-primary text-lg px-8 py-4">Start Free Trial</button>
            <button className="btn-secondary text-lg px-8 py-4 bg-white">Schedule Demo</button>
          </div>
        </div>
      </div>
    </div>
  )
}

