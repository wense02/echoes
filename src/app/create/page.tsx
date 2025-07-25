import { Metadata } from 'next'
import CreateMemorialForm from '@/components/forms/CreateMemorialForm'
import { Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Create Memorial | Forever Missed',
  description: 'Create a beautiful online memorial to honor your loved one.',
}

export default function CreateMemorialPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              Create a Memorial
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Honor your loved one with a beautiful, personalized memorial website 
            that brings family and friends together to share memories and celebrate their life.
          </p>
        </div>

        {/* Form */}
        <CreateMemorialForm />
      </div>
    </div>
  )
}