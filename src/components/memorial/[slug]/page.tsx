// import { Metadata } from 'next/metadata'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Calendar, MapPin, Heart, Share2, Users, Camera } from 'lucide-react'
import { prisma } from '@/lib/db'
import { formatDate, getAge } from '@/lib/utils'
import PhotoGallery from '@/components/memorial/PhotoGallery'
import TributeList from '@/components/memorial/TributeList'
import MemorialTimeline from '@/components/memorial/MemorialTimeline'
import Button from '@/components/ui/Button'
import { Metadata } from 'next'

interface MemorialPageProps {
  params: { slug: string }
}

async function getMemorial(slug: string) {
  const memorial = await prisma.memorial.findUnique({
    where: { slug },
    include: {
      owner: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      photos: {
        select: {
          id: true,
          url: true,
          caption: true,
          createdAt: true,
          uploadedBy: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      tributes: {
        select: {
          id: true,
          content: true,
          type: true,
          createdAt: true,
          author: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      timeline: {
        orderBy: { date: 'asc' },
      },
      _count: {
        select: {
          photos: true,
          tributes: true,
        },
      },
    },
  })

  return memorial
}

export async function generateMetadata({ params }: MemorialPageProps): Promise<Metadata> {
  const memorial = await getMemorial(params.slug)

  if (!memorial) {
    return {
      title: 'Memorial Not Found | Forever Missed',
    }
  }

  return {
    title: `${memorial.firstName} ${memorial.lastName} | Forever Missed`,
    description: memorial.biography || `Memorial page for ${memorial.firstName} ${memorial.lastName}`,
    openGraph: {
      title: `${memorial.firstName} ${memorial.lastName} Memorial`,
      description: memorial.biography || `Remembering ${memorial.firstName} ${memorial.lastName}`,
      images: memorial.avatar ? [memorial.avatar] : [],
    },
  }
}

export default async function MemorialPage({ params }: MemorialPageProps) {
  const memorial = await getMemorial(params.slug)

  if (!memorial) {
    notFound()
  }

  const age = getAge(memorial.dateOfBirth, memorial.dateOfPassing)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary-600 to-primary-800">
        {memorial.coverImage && (
          <Image
            src={memorial.coverImage}
            alt="Cover"
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
            <div className="flex items-end space-x-6">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white p-1 shadow-lg">
                  {memorial.avatar ? (
                    <Image
                      src={memorial.avatar}
                      alt={`${memorial.firstName} ${memorial.lastName}`}
                      width={128}
                      height={128}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                      <Heart className="h-8 w-8 md:h-12 md:w-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-white">
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
                  {memorial.firstName} {memorial.lastName}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
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
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button variant="secondary" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biography */}
            {memorial.biography && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-serif font-semibold mb-4">Life Story</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {memorial.biography}
                  </p>
                </div>
              </div>
            )}

            {/* Timeline */}
            {memorial.timeline.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-serif font-semibold mb-6">Life Timeline</h2>
                <MemorialTimeline events={memorial.timeline} />
              </div>
            )}

            {/* Photo Gallery */}
            {memorial.photos.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-semibold">Photos</h2>
                  <span className="text-sm text-gray-500">
                    {memorial._count.photos} photo{memorial._count.photos !== 1 ? 's' : ''}
                  </span>
                </div>
                <PhotoGallery photos={memorial.photos} />
              </div>
            )}

            {/* Tributes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-semibold">Tributes</h2>
                <span className="text-sm text-gray-500">
                  {memorial._count.tributes} tribute{memorial._count.tributes !== 1 ? 's' : ''}
                </span>
              </div>
              <TributeList tributes={memorial.tributes} memorialId={memorial.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Memorial Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Views</span>
                  <span className="font-medium">{memorial.viewCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Photos</span>
                  <span className="font-medium">{memorial._count.photos}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tributes</span>
                  <span className="font-medium">{memorial._count.tributes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">{formatDate(memorial.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Memorial Owner */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Created By</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  {memorial.owner.avatar ? (
                    <Image
                      src={memorial.owner.avatar}
                      alt={memorial.owner.firstName}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <Users className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {memorial.owner.firstName} {memorial.owner.lastName}
                  </div>
                  <div className="text-sm text-gray-600">Memorial Creator</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Contribute</h3>
              <div className="space-y-3">
                <Button className="w-full" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Add Tribute
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Share Photo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}