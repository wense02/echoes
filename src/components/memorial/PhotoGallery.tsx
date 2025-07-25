'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Photo {
  id: string
  url: string
  caption?: string
  createdAt: Date
  uploadedBy: {
    firstName: string
    lastName: string
  }
}

interface PhotoGalleryProps {
  photos: Photo[]
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)

  const openLightbox = (index: number) => setSelectedPhoto(index)
  const closeLightbox = () => setSelectedPhoto(null)
  
  const nextPhoto = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto((selectedPhoto + 1) % photos.length)
    }
  }
  
  const prevPhoto = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto(selectedPhoto === 0 ? photos.length - 1 : selectedPhoto - 1)
    }
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No photos have been added yet.
      </div>
    )
  }

  return (
    <>
      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => openLightbox(index)}
            className="relative aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity group"
          >
            <Image
              src={photo.url}
              alt={photo.caption || 'Memorial photo'}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedPhoto !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="relative">
              <Image
                src={photos[selectedPhoto].url}
                alt={photos[selectedPhoto].caption || 'Memorial photo'}
                width={800}
                height={600}
                className="max-h-[80vh] w-auto object-contain"
              />
              
              {/* Caption */}
              {(photos[selectedPhoto].caption || photos[selectedPhoto].uploadedBy) && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                  {photos[selectedPhoto].caption && (
                    <p className="text-lg mb-2">{photos[selectedPhoto].caption}</p>
                  )}
                  <div className="text-sm text-gray-300">
                    Uploaded by {photos[selectedPhoto].uploadedBy.firstName} {photos[selectedPhoto].uploadedBy.lastName}
                    {' '} • {formatDate(photos[selectedPhoto].createdAt)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}