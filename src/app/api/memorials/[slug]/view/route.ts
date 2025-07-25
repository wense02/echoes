import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: { slug: string }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await prisma.memorial.update({
      where: { slug: params.slug },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Increment view count error:', error)
    return NextResponse.json(
      { message: 'Failed to increment view count' },
      { status: 500 }
    )
  }
}