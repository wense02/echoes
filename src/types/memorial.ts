export interface Memorial {
  id: string
  slug: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  dateOfPassing: Date
  biography?: string
  location?: string
  avatar?: string
  coverImage?: string
  theme: MemorialTheme
  privacy: MemorialPrivacy
  isActive: boolean
  musicUrl?: string
  musicTitle?: string
  viewCount: number
  createdAt: Date
  updatedAt: Date
  ownerId: string
}

export interface CreateMemorialData {
  firstName: string
  lastName: string
  dateOfBirth: Date
  dateOfPassing: Date
  biography?: string
  location?: string
  theme: MemorialTheme
  privacy: MemorialPrivacy
}

export enum MemorialTheme {
  CLASSIC = 'CLASSIC',
  ELEGANT = 'ELEGANT',
  MODERN = 'MODERN',
  NATURE = 'NATURE',
  PEACEFUL = 'PEACEFUL',
  CELEBRATION = 'CELEBRATION',
  REMEMBRANCE = 'REMEMBRANCE',
  SUNSET = 'SUNSET',
  FLORAL = 'FLORAL',
  MINIMALIST = 'MINIMALIST'
}

export enum MemorialPrivacy {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  INVITE_ONLY = 'INVITE_ONLY'
}