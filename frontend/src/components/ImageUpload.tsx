import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  onUploadComplete: (files: File[]) => void
  isGenerating: boolean
}

export default function ImageUpload({ onUploadComplete, isGenerating }: ImageUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') && file.size <= 50 * 1024 * 1024 // 50MB limit
    )
    
    setUploadedFiles(prev => [...prev, ...imageFiles])
    
    // Simulate upload progress
    imageFiles.forEach(file => {
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))
      simulateProgress(file.name)
    })
  }, [])

  const simulateProgress = (fileName: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(prev => ({ ...prev, [fileName]: progress }))
      if (progress >= 100) {
        clearInterval(interval)
      }
    }, 200)
  }

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName))
    setUploadProgress(prev => {
      const newProgress = { ...prev }
      delete newProgress[fileName]
      return newProgress
    })
  }

  const handleGenerate = () => {
    if (uploadedFiles.length > 0) {
      onUploadComplete(uploadedFiles)
      setUploadedFiles([])
      setUploadProgress({})
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          card cursor-pointer border-2 border-dashed transition-colors
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:border-primary-400'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Upload size={48} className="text-neutral-400 mb-4" />
          <p className="text-lg font-medium text-neutral-700">
            {isDragActive ? 'Drop images here' : 'Drag & drop dress images here'}
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            or click to browse • Supports PNG, JPG, WebP (max 50MB per file)
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            Batch upload supported for multiple designs
          </p>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-neutral-900">
              Uploaded Files ({uploadedFiles.length})
            </h3>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-primary"
            >
              {isGenerating ? 'Generating...' : 'Generate Catalogue'}
            </button>
          </div>

          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg"
              >
                <ImageIcon size={20} className="text-neutral-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {file.name}
                  </p>
                  <div className="mt-1 w-full bg-neutral-200 rounded-full h-1.5">
                    <div
                      className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress[file.name] || 0}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.name)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isGenerating && (
        <div className="card bg-primary-50 border-primary-200">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-600 border-t-transparent"></div>
            <p className="text-primary-700">
              Generating AI model showcases and videos... This may take a few minutes.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}


