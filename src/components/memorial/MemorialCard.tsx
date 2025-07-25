import Link from 'next/link'
import Image from 'next/image'
import { Heart, Calendar, MapPin, Eye } from 'lucide-react'
import { Memorial } from '@/types/memorial'
import { formatDate, getAge } from '@/lib/utils'

interface MemorialCardProps {
  memorial: Memorial
}

export default function MemorialCard({ memorial }: MemorialCardProps) {
  const age = getAge(memorial.dateOfBirth, memorial.dateOfPassing)

  return (
    <Link href={`/memorial/${memorial.slug}`} className="group">
      <div className="memorial-card hover:scale-[1.02] transition-all duration-300">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
          {memorial.avatar ? (
            <Image
              src={memorial.avatar}
              alt={`${memorial.firstName} ${memorial.lastName}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* View Count */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <Eye className="h-3 w-3 text-gray-600" />
            <span className="text-xs text-gray-600">{memorial.viewCount}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2">
            {memorial.firstName} {memorial.lastName}
          </h3>
          
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(memorial.dateOfBirth)} - {formatDate(memorial.dateOfPassing)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Age {age}</span>
            </div>
            {memorial.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{memorial.location}</span>
              </div>
            )}
          </div>

          {memorial.biography && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {memorial.biography}
            </p>
          )}

          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Created {formatDate(memorial.createdAt)}</span>
            <span className="group-hover:text-primary-600 transition-colors">
              View Memorial →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}