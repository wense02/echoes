import { formatDate } from "@/lib/utils"

interface TimelineEvent {
  id: string
  title: string
  description?: string
  date: Date
  location?: string
  photoUrl?: string
}

interface MemorialTimelineProps {
  events: TimelineEvent[]
}

export default function MemorialTimeline({ events }: MemorialTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No timeline events have been added yet.
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      
      <div className="space-y-8">
        {events.map((event) => (
          <div key={event.id} className="relative flex items-start space-x-4">
            {/* Timeline dot */}
            <div className="relative z-10 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 pb-8">
              <div className="text-sm text-gray-500 mb-1">
                {formatDate(event.date)}
                {event.location && ` • ${event.location}`}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {event.title}
              </h3>
              {event.description && (
                <p className="text-gray-600">{event.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}