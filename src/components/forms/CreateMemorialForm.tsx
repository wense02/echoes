'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, Eye, Users, Lock } from 'lucide-react'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import TextArea from '@/components/ui/TextArea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { MemorialTheme, MemorialPrivacy } from '@/types/memorial'
import { memorialService } from '@/lib/memorial'
import toast from 'react-hot-toast'

const createMemorialSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  dateOfPassing: z.string().min(1, 'Date of passing is required'),
  biography: z.string().optional(),
  location: z.string().optional(),
  theme: z.nativeEnum(MemorialTheme),
  privacy: z.nativeEnum(MemorialPrivacy),
}).refine((data) => {
  const birthDate = new Date(data.dateOfBirth)
  const passingDate = new Date(data.dateOfPassing)
  return birthDate < passingDate
}, {
  message: 'Date of passing must be after date of birth',
  path: ['dateOfPassing']
})

type CreateMemorialFormData = z.infer<typeof createMemorialSchema>

const themes = [
  { value: MemorialTheme.CLASSIC, label: 'Classic', description: 'Timeless and elegant' },
  { value: MemorialTheme.ELEGANT, label: 'Elegant', description: 'Sophisticated and refined' },
  { value: MemorialTheme.MODERN, label: 'Modern', description: 'Clean and contemporary' },
  { value: MemorialTheme.NATURE, label: 'Nature', description: 'Peaceful natural tones' },
  { value: MemorialTheme.PEACEFUL, label: 'Peaceful', description: 'Serene and calming' },
  { value: MemorialTheme.CELEBRATION, label: 'Celebration', description: 'Joyful and vibrant' },
]

const privacyOptions = [
  {
    value: MemorialPrivacy.PUBLIC,
    label: 'Public',
    description: 'Anyone can view and contribute',
    icon: Eye
  },
  {
    value: MemorialPrivacy.INVITE_ONLY,
    label: 'Invite Only',
    description: 'Only invited people can view',
    icon: Users
  },
  {
    value: MemorialPrivacy.PRIVATE,
    label: 'Private',
    description: 'Only you can view and edit',
    icon: Lock
  },
]

export default function CreateMemorialForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateMemorialFormData>({
    resolver: zodResolver(createMemorialSchema),
    defaultValues: {
      theme: MemorialTheme.CLASSIC,
      privacy: MemorialPrivacy.PUBLIC,
    },
  })

  const selectedTheme = watch('theme')
  const selectedPrivacy = watch('privacy')

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setAvatarPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: CreateMemorialFormData) => {
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })
      
      if (avatarFile) {
        formData.append('avatar', avatarFile)
      }

      const memorial = await memorialService.create(formData)
      toast.success('Memorial created successfully!')
      router.push(`/memorial/${memorial.slug}`)
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to create memorial')
      }
    }
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${currentStep >= step 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
                }
              `}>
                {step}
              </div>
              {step < 3 && (
                <div className={`
                  w-12 h-px ml-2
                  ${currentStep > step ? 'bg-primary-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Basic Info</span>
          <span>Personalize</span>
          <span>Privacy</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Tell us about your loved one</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                        width={96}
                        height={96}
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-sm text-gray-600">Add a profile photo</p>

              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="Enter first name"
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
                <Input
                  label="Last Name"
                  placeholder="Enter last name"
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date of Birth"
                  type="date"
                  error={errors.dateOfBirth?.message}
                  {...register('dateOfBirth')}
                />
                <Input
                  label="Date of Passing"
                  type="date"
                  error={errors.dateOfPassing?.message}
                  {...register('dateOfPassing')}
                />
              </div>

              {/* Location */}
              <Input
                label="Location (Optional)"
                placeholder="e.g., New York, NY"
                {...register('location')}
              />

              <div className="flex justify-end">
                <Button onClick={nextStep} type="button">
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Personalization */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Personalize the memorial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Biography */}
              <TextArea
                label="Biography (Optional)"
                placeholder="Share the story of your loved one's life..."
                rows={5}
                {...register('biography')}
              />

              {/* Theme Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose a Theme
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {themes.map((theme) => (
                    <button
                      key={theme.value}
                      type="button"
                      onClick={() => setValue('theme', theme.value)}
                      className={`
                        p-4 rounded-lg border-2 text-left transition-colors
                        ${selectedTheme === theme.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="font-medium">{theme.label}</div>
                      <div className="text-sm text-gray-600">{theme.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button onClick={prevStep} type="button" variant="outline">
                  Back
                </Button>
                <Button onClick={nextStep} type="button">
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Privacy Settings */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Who can see this memorial?
                </label>
                <div className="space-y-3">
                  {privacyOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setValue('privacy', option.value)}
                        className={`
                          w-full p-4 rounded-lg border-2 text-left transition-colors flex items-start space-x-3
                          ${selectedPrivacy === option.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-between">
                <Button onClick={prevStep} type="button" variant="outline">
                  Back
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Create Memorial
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  )
}