import { Metadata } from 'next'
import MemorialGallery from '@/components/memorial/MemorialGallery'

export const metadata: Metadata = {
  title: 'Memorial Gallery | Forever Missed',
  description: 'Browse beautiful memorial websites honoring loved ones from families around the world.',
}

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <MemorialGallery showHeader={true} />
    </div>
  )
}
