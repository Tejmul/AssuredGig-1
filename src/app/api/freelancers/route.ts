import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  skills: z.string().optional(),
  minRate: z.string().optional(),
  maxRate: z.string().optional(),
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
      role: "FREELANCER",
      ...(query.search && {
        OR: [
          { name: { contains: query.search } },
          { bio: { contains: query.search } },
        ],
      }),
      ...(query.skills && {
        skills: {
          hasSome: query.skills.split(","),
        },
      }),
      ...(query.minRate && {
        rate: {
          gte: Number(query.minRate),
        },
      }),
      ...(query.maxRate && {
        rate: {
          lte: Number(query.maxRate),
        },
      }),
    }

    // Get total count for pagination
    const total = await prisma.user.count({ where })

    // Get freelancers
    const freelancers = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        bio: true,
        skills: true,
        portfolio: true,
        rate: true,
        createdAt: true,
        _count: {
          select: {
            contracts: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    })

    return NextResponse.json({
      freelancers,
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