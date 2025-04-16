import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Simple query to test database connection
    const result = await db.$queryRaw`SELECT 1 as test`
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Database connection successful",
        result
      },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  } catch (error) {
    console.error('Database connection error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
} 