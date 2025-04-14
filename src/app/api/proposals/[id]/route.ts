import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth.config"
import { z } from "zod"
import { ProposalStatus } from "@prisma/client"
import { Role } from "@prisma/client"

const updateProposalSchema = z.object({
  coverLetter: z.string().min(10, "Cover letter must be at least 10 characters").optional(),
  bidAmount: z.number().min(1, "Bid amount must be at least 1").optional(),
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]).optional(),
  feedback: z.string().optional(),
})

const proposalSchema = z.object({
  coverLetter: z.string().min(10, "Cover letter must be at least 10 characters").optional(),
  bidAmount: z.number().min(1, "Bid amount must be at least 1").optional(),
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]).optional(),
})

interface Session {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: Role;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
  };
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

    const proposal = await db.proposal.findUnique({
      where: { id: params.id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            description: true,
            budget: true,
            deadline: true,
            skills: true,
            client: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
            hourlyRate: true,
            skills: true,
            portfolio: true,
          },
        },
      },
    })

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      )
    }

    // Check if user has access to this proposal
    if (
      proposal.job.client.id !== session.user.id &&
      proposal.freelancer.id !== session.user.id
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    return NextResponse.json(proposal)
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
    const data = updateProposalSchema.parse(body)

    const proposal = await db.proposal.findUnique({
      where: { id: params.id },
      include: {
        job: {
          select: {
            clientId: true,
          },
        },
        freelancer: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      )
    }

    // Check if user has permission to update this proposal
    if (
      proposal.job.clientId !== session.user.id &&
      proposal.freelancer.id !== session.user.id
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Only allow status updates from the client
    if (proposal.job.clientId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the client can update the proposal status" },
        { status: 403 }
      )
    }

    const updatedProposal = await db.proposal.update({
      where: { id: params.id },
      data: {
        status: data.status,
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

    return NextResponse.json(updatedProposal)
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
    const session = await getServerSession(authOptions) as Session | null

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const proposal = await db.proposal.findUnique({
      where: { id: params.id },
      include: {
        job: {
          select: {
            clientId: true,
            status: true,
          },
        },
      },
    })

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      )
    }

    // Only freelancers can delete their own proposals
    if (
      session.user.role !== "FREELANCER" ||
      proposal.freelancerId !== session.user.id
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Cannot delete accepted proposals
    if (proposal.status === "ACCEPTED") {
      return NextResponse.json(
        { error: "Cannot delete an accepted proposal" },
        { status: 400 }
      )
    }

    await db.proposal.delete({
      where: { id: params.id },
    })

    return NextResponse.json(
      { message: "Proposal deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[PROPOSAL_DELETE]", error)
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    )
  }
} 