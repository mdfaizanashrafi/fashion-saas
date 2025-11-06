import { useState } from 'react'
import { Download, Play, Image as ImageIcon, Video } from 'lucide-react'
import { CatalogueItem } from '../types'
import clsx from 'clsx'

interface CatalogueDisplayProps {
  items: CatalogueItem[]
}

export default function CatalogueDisplay({ items }: CatalogueDisplayProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'pictures' | 'clips' | 'videos'>('all')

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
  }

  const handleBulkExport = () => {
    // Implement bulk export functionality
    alert('Bulk export feature - downloads all catalogue items as a ZIP file')
  }

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.type === selectedCategory)

  const categories = [
    { id: 'all' as const, label: 'All', count: items.length },
    { id: 'pictures' as const, label: 'Pictures', count: items.filter(i => i.type === 'pictures').length },
    { id: 'clips' as const, label: '15s Clips', count: items.filter(i => i.type === 'clips').length },
    { id: 'videos' as const, label: 'Runway Videos', count: items.filter(i => i.type === 'videos').length },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900">Generated Catalogue</h2>
        <button onClick={handleBulkExport} className="btn-secondary">
          <Download size={18} className="mr-2" />
          Bulk Export
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors',
              selectedCategory === category.id
                ? 'bg-primary-600 text-white'
                : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
            )}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-neutral-500">No items in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="card group">
              <div className="relative aspect-[3/4] bg-neutral-100 rounded-lg mb-4 overflow-hidden">
                {item.type === 'pictures' ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      <Play size={48} className="text-white" />
                    </div>
                  </div>
                )}
                
                <div className="absolute top-2 right-2">
                  {item.type === 'pictures' ? (
                    <ImageIcon size={20} className="text-white drop-shadow" />
                  ) : (
                    <Video size={20} className="text-white drop-shadow" />
                  )}
                </div>
              </div>

              <h3 className="font-semibold text-neutral-900 mb-2">{item.title}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <span className="font-medium">Market Appeal:</span>
                  <span className="text-primary-600">{item.metadata.marketAppeal}%</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {item.metadata.styleTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {item.metadata.bodyDiversity && (
                  <p className="text-xs text-neutral-500">
                    Body Diversity: {item.metadata.bodyDiversity}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleDownload(item.downloadUrl, item.title)}
                className="w-full btn-secondary"
              >
                <Download size={18} className="mr-2" />
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


