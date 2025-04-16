import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { Session } from "next-auth"
import { authOptions } from "@/lib/auth.config"
import { z } from "zod"
import { ProposalStatus, Role } from "@prisma/client"
import { db } from "@/lib/db"

// Validation schemas
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
      ...(session.user.role === "CLIENT"
        ? { job: { clientId: session.user.id } }
        : { freelancerId: session.user.id }),
      ...(query.status && { status: query.status }),
    };

    // Get total count and proposals in parallel
    const [total, proposals] = await Promise.all([
      prisma.proposal.count({ where }),
      prisma.proposal.findMany({
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
      }),
    ]);

    return NextResponse.json({
      proposals,
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

    if (session.user.role !== "FREELANCER") {
      return NextResponse.json(
        { error: "Only freelancers can submit proposals" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const data = proposalSchema.parse(body);

    // Run validations in parallel
    const [job, existingProposal] = await Promise.all([
      prisma.job.findUnique({
        where: { id: data.jobId },
        select: { status: true },
      }),
      prisma.proposal.findFirst({
        where: {
          jobId: data.jobId,
          freelancerId: session.user.id,
        },
      }),
    ]);

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    if (job.status !== "OPEN") {
      return NextResponse.json(
        { error: "This job is no longer accepting proposals" },
        { status: 400 }
      );
    }

    if (existingProposal) {
      return NextResponse.json(
        { error: "You have already submitted a proposal for this job" },
        { status: 400 }
      );
    }

    const proposal = await prisma.proposal.create({
      data: {
        ...data,
        freelancerId: session.user.id,
        status: ProposalStatus.PENDING,
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
    });

    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST_OLD(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is a freelancer
    if (session.user.role !== "FREELANCER") {
      return NextResponse.json(
        { error: "Only freelancers can submit proposals" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const data = proposalSchema.parse(body);
    
    // Check if job exists and is open
    const job = await db.job.findUnique({
      where: { id: data.jobId },
    });
    
    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }
    
    if (job.status !== "open") {
      return NextResponse.json(
        { error: "This job is no longer accepting proposals" },
        { status: 400 }
      );
    }
    
    // Check if freelancer has already submitted a proposal
    const existingProposal = await db.proposal.findFirst({
      where: {
        jobId: data.jobId,
        freelancerId: session.user.id,
      },
    });
    
    if (existingProposal) {
      return NextResponse.json(
        { error: "You have already submitted a proposal for this job" },
        { status: 400 }
      );
    }
    
    // Create the proposal
    const proposal = await db.proposal.create({
      data: {
        ...data,
        freelancerId: session.user.id,
      },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
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
      },
    });
    
    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    console.error("Error creating proposal:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET_OLD(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    
    // If jobId is provided, get proposals for that job
    if (jobId) {
      const job = await db.job.findUnique({
        where: { id: jobId },
      });
      
      if (!job) {
        return NextResponse.json(
          { error: "Job not found" },
          { status: 404 }
        );
      }
      
      // Only job owner can view proposals
      if (job.clientId !== session.user.id) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }
      
      const proposals = await db.proposal.findMany({
        where: { jobId },
        include: {
          freelancer: {
            select: {
              id: true,
              name: true,
              image: true,
              skills: true,
              portfolio: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      
      return NextResponse.json(proposals);
    }
    
    // Otherwise, get user's proposals
    const proposals = await db.proposal.findMany({
      where: {
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json(proposals);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 