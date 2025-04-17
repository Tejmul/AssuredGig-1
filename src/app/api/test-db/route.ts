import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic';

// Custom BigInt serializer
const bigIntSerializer = (key: string, value: any) => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
};

export async function GET() {
  try {
    // Simple query to test database connection
    const result = await db.$queryRaw`SELECT 1 as test`
    
    return new NextResponse(
      JSON.stringify(
        { 
          success: true, 
          message: "Database connection successful",
          result
        },
        bigIntSerializer
      ),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  } catch (error) {
    console.error('Database connection error:', error)
    
    return new NextResponse(
      JSON.stringify(
        { 
          success: false, 
          message: "Database connection failed",
          error: error instanceof Error ? error.message : "Unknown error"
        },
        bigIntSerializer
      ),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
} 