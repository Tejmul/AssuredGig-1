import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { headers } from 'next/headers'
import { rateLimit } from '@/lib/rate-limit'

import { db } from '@/lib/db'

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per interval
})

// Validation schema
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["client", "freelancer"], {
    required_error: "Role must be either client or freelancer",
  }),
})

export async function POST(req: Request) {
  try {
    // Rate limiting
    try {
      const ip = headers().get("x-forwarded-for") ?? "127.0.0.1"
      await limiter.check(10, ip) // 10 requests per minute per IP
    } catch {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    const body = await req.json()

    // Validate input
    try {
      registerSchema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { message: error.errors[0].message },
          { status: 400 }
        )
      }
      throw error
    }

    const { email, password, name, role } = body

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name: name.trim(),
        password: hashedPassword,
        role,
      },
    })

    // Remove sensitive data from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        user: userWithoutPassword,
      },
      { 
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        }
      }
    )
  } catch (error) {
    console.error('Registration error:', error)
    
    // Don't expose internal errors to client
    return NextResponse.json(
      { message: "An error occurred while creating your account" },
      { status: 500 }
    )
  }
} 