import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { z } from "zod"

const proposalSchema = z.object({
  jobId: z.string(),
  coverLetter: z.string().min(10, "Cover letter must be at least 10 characters"),
  bidAmount: z.number().min(1, "Bid amount must be at least 1"),
})

const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]).optional(),
})

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))

    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const skip = (page - 1) * limit

    // Build filter conditions
    const where = {
      ...(session.user.role === "CLIENT"
        ? { job: { clientId: session.user.id } }
        : { freelancerId: session.user.id }),
      ...(query.status && { status: query.status }),
    }

    // Get total count for pagination
    const total = await prisma.proposal.count({ where })

    // Get proposals
    const proposals = await prisma.proposal.findMany({
      where,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            budget: true,
            client: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        freelancer: {
          select: {
            id: true,
            name: true,
            skills: true,
            rate: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    })

    return NextResponse.json({
      proposals,
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

    if (session.user.role !== "FREELANCER") {
      return NextResponse.json(
        { error: "Only freelancers can submit proposals" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const data = proposalSchema.parse(body)

    // Check if job exists and is open
    const job = await prisma.job.findUnique({
      where: { id: data.jobId },
      select: { status: true },
    })

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    if (job.status !== "OPEN") {
      return NextResponse.json(
        { error: "This job is no longer accepting proposals" },
        { status: 400 }
      )
    }

    // Check if freelancer has already submitted a proposal
    const existingProposal = await prisma.proposal.findFirst({
      where: {
        jobId: data.jobId,
        freelancerId: session.user.id,
      },
    })

    if (existingProposal) {
      return NextResponse.json(
        { error: "You have already submitted a proposal for this job" },
        { status: 400 }
      )
    }

    const proposal = await prisma.proposal.create({
      data: {
        ...data,
        freelancerId: session.user.id,
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            client: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        freelancer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(proposal, { status: 201 })
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