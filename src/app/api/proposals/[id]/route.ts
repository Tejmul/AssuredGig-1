import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { z } from "zod"

const updateProposalSchema = z.object({
  coverLetter: z.string().min(10, "Cover letter must be at least 10 characters").optional(),
  bidAmount: z.number().min(1, "Bid amount must be at least 1").optional(),
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]).optional(),
  feedback: z.string().optional(),
})

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const proposal = await prisma.proposal.findUnique({
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
            skills: true,
            rate: true,
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
      session.user.role === "CLIENT" &&
      proposal.job.client.id !== session.user.id
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    if (
      session.user.role === "FREELANCER" &&
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
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const proposal = await prisma.proposal.findUnique({
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

    // Check if user has access to this proposal
    if (
      session.user.role === "CLIENT" &&
      proposal.job.clientId !== session.user.id
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    if (
      session.user.role === "FREELANCER" &&
      proposal.freelancerId !== session.user.id
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Only freelancers can update cover letter and bid amount
    if (
      session.user.role === "CLIENT" &&
      (req.body.coverLetter || req.body.bidAmount)
    ) {
      return NextResponse.json(
        { error: "Clients can only update proposal status" },
        { status: 403 }
      )
    }

    // Only clients can update status
    if (
      session.user.role === "FREELANCER" &&
      req.body.status
    ) {
      return NextResponse.json(
        { error: "Freelancers cannot update proposal status" },
        { status: 403 }
      )
    }

    // Check if job is still open when accepting proposal
    if (
      req.body.status === "ACCEPTED" &&
      proposal.job.status !== "OPEN"
    ) {
      return NextResponse.json(
        { error: "Cannot accept proposal for a closed job" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const data = updateProposalSchema.parse(body)

    // Prepare update data
    const updateData: any = {}
    
    if (data.coverLetter) updateData.coverLetter = data.coverLetter
    if (data.bidAmount) updateData.bidAmount = data.bidAmount
    if (data.status) updateData.status = data.status
    if (data.feedback) updateData.feedback = data.feedback

    const updatedProposal = await prisma.proposal.update({
      where: { id: params.id },
      data: updateData,
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

    // If proposal is accepted, update job status and create contract
    if (data.status === "ACCEPTED") {
      await prisma.$transaction([
        prisma.job.update({
          where: { id: proposal.jobId },
          data: { status: "IN_PROGRESS" },
        }),
        prisma.contract.create({
          data: {
            jobId: proposal.jobId,
            freelancerId: proposal.freelancerId,
            clientId: proposal.job.clientId,
            amount: proposal.bidAmount,
            status: "ACTIVE",
          },
        }),
      ])
    }

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
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const proposal = await prisma.proposal.findUnique({
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

    await prisma.proposal.delete({
      where: { id: params.id },
    })

    return NextResponse.json(
      { message: "Proposal deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
} 