'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import TextArea from '@/components/ui/TextArea'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

const tributeSchema = z.object({
  content: z.string().min(10, 'Tribute must be at least 10 characters'),
  type: z.enum(['MESSAGE', 'STORY', 'MEMORY', 'CONDOLENCE']),
  authorName: z.string().min(2, 'Name is required'),
})

type TributeFormData = z.infer<typeof tributeSchema>

interface TributeFormProps {
  memorialId: string
  onSuccess: () => void
}

export default function TributeForm({ memorialId, onSuccess }: TributeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TributeFormData>({
    resolver: zodResolver(tributeSchema),
    defaultValues: {
      type: 'MESSAGE',
    },
  })

  const onSubmit = async (data: TributeFormData) => {
    try {
      setIsSubmitting(true)
      
      const response = await fetch(`/api/tributes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          memorialId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit tribute')
      }

      toast.success('Thank you for your tribute. It will be reviewed before being published.')
      reset()
      onSuccess()
    } catch (error) {
      toast.error('Failed to submit tribute. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          placeholder="Your name"
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          {...register('authorName')}
        />
        
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          {...register('type')}
        >
          <option value="MESSAGE">Message</option>
          <option value="MEMORY">Memory</option>
          <option value="STORY">Story</option>
          <option value="CONDOLENCE">Condolence</option>
        </select>
      </div>

      <TextArea
        placeholder="Share your tribute, memory, or message..."
        rows={4}
        error={errors.content?.message}
        {...register('content')}
      />

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Submit Tribute
        </Button>
      </div>
    </form>
  )
}