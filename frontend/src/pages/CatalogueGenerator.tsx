import { useState } from 'react'
import ImageUpload from '../components/ImageUpload'
import CatalogueDisplay from '../components/CatalogueDisplay'
import { CatalogueItem } from '../types'

export default function CatalogueGenerator() {
  const [catalogueItems, setCatalogueItems] = useState<CatalogueItem[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleUploadComplete = async (files: File[]) => {
    setIsGenerating(true)
    try {
      // Simulate API call
      const formData = new FormData()
      files.forEach(file => formData.append('images', file))

      const response = await fetch('/api/catalogue/generate', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to generate catalogue')

      const data = await response.json()
      setCatalogueItems(prev => [...prev, ...data.items])
    } catch (error) {
      console.error('Error generating catalogue:', error)
      alert('Failed to generate catalogue. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Catalogue Generator</h1>
        <p className="text-neutral-600 mt-2">
          Upload dress images to generate AI-powered model showcases with videos
        </p>
      </div>

      <ImageUpload 
        onUploadComplete={handleUploadComplete}
        isGenerating={isGenerating}
      />

      {catalogueItems.length > 0 && (
        <CatalogueDisplay items={catalogueItems} />
      )}
    </div>
  )
}


