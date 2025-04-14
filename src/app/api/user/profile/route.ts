import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'

// Helper function to get user from token
async function getUserFromToken() {
  const token = cookies().get('token')?.value

  if (!token) {
    return null
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string }
    return decoded.userId
  } catch (error) {
    return null
  }
}

// GET /api/user/profile
export async function GET() {
  try {
    const userId = await getUserFromToken()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        skills: true,
        hourlyRate: true,
        portfolio: true,
        location: true,
        availability: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// PUT /api/user/profile
export async function PUT(request: Request) {
  try {
    const userId = await getUserFromToken()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        bio: data.bio,
        skills: data.skills,
        hourlyRate: data.hourlyRate,
        portfolio: data.portfolio,
        location: data.location,
        availability: data.availability,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        skills: true,
        hourlyRate: true,
        portfolio: true,
        location: true,
        availability: true,
      },
    })

    return NextResponse.json({
      user: updatedUser,
      message: 'Profile updated successfully',
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
} 