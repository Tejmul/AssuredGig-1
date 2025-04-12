import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { z } from "zod"

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))

    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const skip = (page - 1) * limit

    // Build filter conditions
    const where = {
      status: "OPEN",
      ...(query.search && {
        OR: [
          { title: { contains: query.search } },
          { description: { contains: query.search } },
        ],
      }),
      ...(query.category && {
        category: query.category,
      }),
      ...(query.minBudget && {
        budget: {
          gte: Number(query.minBudget),
        },
      }),
      ...(query.maxBudget && {
        budget: {
          lte: Number(query.maxBudget),
        },
      }),
    }

    // Get total count for pagination
    const total = await prisma.job.count({ where })

    // Get jobs
    const jobs = await prisma.job.findMany({
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
    })

    return NextResponse.json({
      jobs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (session.user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Only clients can post jobs" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const data = jobSchema.parse(body)

    const job = await prisma.job.create({
      data: {
        ...data,
        clientId: session.user.id,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
} 