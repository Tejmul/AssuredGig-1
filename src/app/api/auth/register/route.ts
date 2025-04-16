import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { headers } from 'next/headers'
import { rateLimit } from '@/lib/rate-limit'
import { UserRole } from '@/lib/auth'
import { Prisma } from '@prisma/client'
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
  role: z.enum(["CLIENT", "FREELANCER"] as const, {
    required_error: "Role must be either CLIENT or FREELANCER",
  }),
})

export async function POST(req: Request) {
  try {
    // Check if database is connected
    try {
      await db.$queryRaw`SELECT 1`
      console.log("Database connection test successful")
    } catch (error) {
      console.error("Database connection test failed:", error)
      return NextResponse.json(
        { message: "Database connection error" },
        { status: 503 }
      )
    }

    console.log("Registration request received")
    
    // Rate limiting
    try {
      const ip = headers().get("x-forwarded-for") ?? "127.0.0.1"
      await limiter.check(10, ip) // 10 requests per minute per IP
      console.log("Rate limit check passed")
    } catch (error) {
      console.error("Rate limit error:", error)
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    let body
    try {
      body = await req.json()
      console.log("Request body:", { ...body, password: "[REDACTED]" })
    } catch (error) {
      console.error("Failed to parse request body:", error)
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      )
    }

    // Validate input
    try {
      registerSchema.parse(body)
      console.log("Input validation passed")
    } catch (error) {
      console.error("Validation error:", error)
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
    console.log("Checking if user exists:", email)
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      console.log("User already exists:", email)
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    console.log("Hashing password")
    const hashedPassword = await hash(password, 12)

    // Create user with the new password field
    console.log("Creating user:", { email, name, role })
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name: name.trim(),
        password: hashedPassword,
        role: role as UserRole,
      },
    })
    console.log("User created successfully:", user.id)

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
    console.error('Registration error:', {
      error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      switch (error.code) {
        case 'P2002':
          return NextResponse.json(
            { message: "An account with this email already exists" },
            { status: 400 }
          )
        case 'P2003':
          return NextResponse.json(
            { message: "Database constraint violation" },
            { status: 400 }
          )
        default:
          console.error("Unhandled Prisma error:", {
            code: error.code,
            message: error.message,
            meta: error.meta,
          })
      }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      console.error("Prisma validation error:", error)
      return NextResponse.json(
        { message: "Invalid data provided" },
        { status: 400 }
      )
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error("Prisma initialization error:", error)
      return NextResponse.json(
        { message: "Database connection error" },
        { status: 503 }
      )
    }
    
    // Return more detailed error information in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `An error occurred: ${error instanceof Error ? error.message : String(error)}`
      : "An error occurred while creating your account"
    
    // Ensure we always return a properly formatted JSON response
    return NextResponse.json(
      { message: errorMessage },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
} 