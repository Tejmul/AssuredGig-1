import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth.config"
import { z } from "zod"
import { JobStatus, Role } from "@prisma/client"
import type { Session } from "next-auth"

// Validation schemas
const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  budget: z.number().min(1, "Budget must be at least 1"),
  deadline: z.string().optional(),
  skills: z.array(z.string()).optional(),
  isPremium: z.boolean().optional(),
})

const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  category: z.string().optional(),
  minBudget: z.string().optional(),
  maxBudget: z.string().optional(),
  search: z.string().optional(),
})

// Error handling utility
const handleApiError = (error: unknown) => {
  console.error("[API_ERROR]", error);
  
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: error.errors[0].message },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
};

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = querySchema.parse(Object.fromEntries(searchParams));

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where = {
      status: JobStatus.OPEN,
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
        ],
      }),
      ...(query.category && { category: query.category }),
      ...((query.minBudget || query.maxBudget) && {
        budget: {
          ...(query.minBudget && { gte: Number(query.minBudget) }),
          ...(query.maxBudget && { lte: Number(query.maxBudget) }),
        },
      }),
    };

    // Get total count and jobs in parallel
    const [total, jobs] = await Promise.all([
      db.job.count({ where }),
      db.job.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              _count: {
                select: {
                  contracts: true,
                },
              },
            },
          },
          _count: {
            select: {
              proposals: true,
            },
          },
        },
        orderBy: [
          { isPremium: "desc" },
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      jobs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Only clients can post jobs" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const data = jobSchema.parse(body);

    const job = await db.job.create({
      data: {
        ...data,
        clientId: session.user.id,
        status: JobStatus.OPEN, // Explicitly set initial status
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
} 