import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import type { Session as NextAuthSession } from "next-auth"
import { authOptions } from "@/lib/auth.config"
import { z } from "zod"
import { JobStatus, ProposalStatus, Prisma } from "@prisma/client"

const updateJobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  budget: z.number().min(1, "Budget must be at least 1").optional(),
  deadline: z.string().optional(),
  skills: z.array(z.string()).optional(),
  status: z.enum(["OPEN", "CLOSED"]).optional(),
  isPremium: z.boolean().optional(),
})

interface Session extends NextAuthSession {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: JobStatus;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
  };
}

type FreelancerSelect = {
  id: string
  name: string
  email: string
  rate: number | null
  skills: Prisma.JsonValue
  portfolio: Prisma.JsonValue
}

type ProposalWithFreelancer = {
  freelancer: FreelancerSelect
  status: ProposalStatus
  id: string
  createdAt: Date
  updatedAt: Date
  jobId: string
  freelancerId: string
  coverLetter: string
  bidAmount: number
  feedback: string | null
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const job = await db.job.findUnique({
      where: { id: params.id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        proposals: {
          include: {
            freelancer: {
              select: {
                id: true,
                name: true,
                email: true,
                rate: true,
                skills: true,
                portfolio: true,
              },
            },
          },
        },
      },
    }) as { client: { id: string; name: string; email: string }; proposals: ProposalWithFreelancer[] } | null;

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    // Check if user has access to this job
    if (
      job.client.id !== session.user.id &&
      !job.proposals.some((p) => p.freelancer.id === session.user.id)
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    return NextResponse.json(job)
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json()
    const data = updateJobSchema.parse(body)

    const job = await db.job.findUnique({
      where: { id: params.id },
      include: {
        client: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    // Check if user has permission to update this job
    if (job.client.id !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const updatedJob = await db.job.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        budget: data.budget,
        deadline: data.deadline,
        skills: data.skills,
        status: data.status,
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

    return NextResponse.json(updatedJob)
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const job = await db.job.findUnique({
      where: { id: params.id },
      include: {
        client: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    // Check if user has permission to delete this job
    if (job.client.id !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    await db.job.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
} 