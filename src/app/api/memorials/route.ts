import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/utils'
import { z } from 'zod'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const createMemorialSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string(),
  dateOfPassing: z.string(),
  biography: z.string().optional(),
  location: z.string().optional(),
  theme: z.string(),
  privacy: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authorization = request.headers.get('Authorization')
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authorization.substring(7)
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    // Parse form data
    const formData = await request.formData()
    const data = Object.fromEntries(formData.entries())
    
    const validatedData = createMemorialSchema.parse(data)
    
    // Handle avatar upload
    let avatarUrl = null
    const avatarFile = formData.get('avatar') as File
    if (avatarFile && avatarFile.size > 0) {
      const bytes = await avatarFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'memorials/avatars' },
          (error, result) => {
            if (error) reject(error)
            else if (result) resolve(result)
            else reject(new Error('Cloudinary upload returned undefined result'))
          }
        ).end(buffer)
      }) as UploadApiResponse
      
      avatarUrl = uploadResult.secure_url
    }

    // Generate unique slug
    const baseSlug = slugify(`${validatedData.firstName}-${validatedData.lastName}`)
    let slug = baseSlug
    let counter = 1
    
    while (await prisma.memorial.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create memorial
    const memorial = await prisma.memorial.create({
      data: {
        slug,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        dateOfPassing: new Date(validatedData.dateOfPassing),
        biography: validatedData.biography,
        location: validatedData.location,
        avatar: avatarUrl,
        theme: validatedData.theme as string,
        privacy: validatedData.privacy as "PUBLIC" | "PRIVATE",
        ownerId: payload.userId,
      },
    })

    return NextResponse.json(memorial, { status: 201 })
  } catch (error) {
    console.error('Create memorial error:', error)
    return NextResponse.json(
      { message: 'Failed to create memorial' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    const memorials = await prisma.memorial.findMany({
      where: {
        isActive: true,
        privacy: 'PUBLIC',
      },
      select: {
        id: true,
        slug: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        dateOfPassing: true,
        avatar: true,
        theme: true,
        viewCount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    })

    const total = await prisma.memorial.count({
      where: {
        isActive: true,
        privacy: 'PUBLIC',
      },
    })

    return NextResponse.json({ memorials, total })
  } catch (error) {
    console.error('Get memorials error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch memorials' },
      { status: 500 }
    )
  }
}