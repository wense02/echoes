'use client'

import { useState } from 'react'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { Heart, MessageCircle, Users, Plus } from 'lucide-react'
import Button from '@/components/ui/Button'
import TributeForm from './TributeForm'

interface Tribute {
  id: string
  content: string
  type: string
  createdAt: Date
  author: {
    firstName: string
    lastName: string
    avatar?: string
  }
}

interface TributeListProps {
  tributes: Tribute[]
  memorialId: string
}

export default function TributeList({ tributes, memorialId }: TributeListProps) {
  const [showForm, setShowForm] = useState(false)

  const getTributeIcon = (type: string) => {
    switch (type) {
      case 'MEMORY':
        return <Heart className="h-4 w-4 text-red-500" />
      case 'STORY':
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Heart className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Tribute Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "outline" : "primary"}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Tribute'}
        </Button>
      </div>

      {/* Tribute Form */}
      {showForm && (
        <div className="border-t pt-6">
          <TributeForm
            memorialId={memorialId}
            onSuccess={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Tributes List */}
      {tributes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No tributes have been shared yet.</p>
          <p className="text-sm">Be the first to share a memory or tribute.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {tributes.map((tribute) => (
            <div key={tribute.id} className="border-b border-gray-100 pb-6 last:border-b-0">
              <div className="flex space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {tribute.author.avatar ? (
                      <Image
                        src={tribute.author.avatar}
                        alt={tribute.author.firstName}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <Users className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {tribute.author.firstName} {tribute.author.lastName}
                    </span>
                    {getTributeIcon(tribute.type)}
                    <span className="text-sm text-gray-500">
                      {formatDate(tribute.createdAt)}
                    </span>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {tribute.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}