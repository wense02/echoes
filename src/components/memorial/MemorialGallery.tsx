'use client'

import { useEffect, useState } from 'react'
import { Memorial } from '@/types/memorial'
import { memorialService } from '@/lib/memorial'
import MemorialCard from './MemorialCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import Button from '@/components/ui/Button'
import { Heart, ArrowRight } from 'lucide-react'

interface MemorialGalleryProps {
  limit?: number
  showHeader?: boolean
}

export default function MemorialGallery({ limit, showHeader = true }: MemorialGalleryProps) {
  const [memorials, setMemorials] = useState<Memorial[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchMemorials()
  }, [])

  const fetchMemorials = async () => {
    try {
      const response = await memorialService.getPublicMemorials(1, limit || 12)
      setMemorials(response.memorials)
      setHasMore(response.memorials.length < response.total)
    } catch (error) {
      console.error('Failed to fetch memorials:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = async () => {
    if (!hasMore) return
    
    try {
      setLoading(true)
      const nextPage = page + 1
      const response = await memorialService.getPublicMemorials(nextPage, limit || 12)
      setMemorials(prev => [...prev, ...response.memorials])
      setPage(nextPage)
      setHasMore(response.memorials.length === (limit || 12))
    } catch (error) {
      console.error('Failed to load more memorials:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && memorials.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="text-center mb-12">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-primary-600" />
              <h2 className="text-3xl font-serif font-bold text-gray-900">
                Memorial Gallery
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Honoring the lives and memories of loved ones from families around the world
            </p>
          </div>
        )}

        {memorials.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No memorials yet</h3>
            <p className="text-gray-600">Be the first to create a memorial.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {memorials.map((memorial) => (
                <MemorialCard key={memorial.id} memorial={memorial} />
              ))}
            </div>

            {hasMore && !limit && (
              <div className="text-center mt-12">
                <Button
                  onClick={loadMore}
                  variant="outline"
                  size="lg"
                  isLoading={loading}
                >
                  Load More Memorials
                </Button>
              </div>
            )}

            {limit && hasMore && (
              <div className="text-center mt-12">
                <Button
                  variant="outline"
                  size="lg"
                  className="group"
                >
                  View All Memorials
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}