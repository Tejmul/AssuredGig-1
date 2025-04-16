import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const proposalSchema = z.object({
  coverLetter: z.string().min(100),
  timeline: z.string(),
  price: z.number().min(5),
  portfolioId: z.string()
});

export async function POST(
  req: Request,
  { params }: { params: { gigId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = proposalSchema.parse(json);

    // Check if gig exists and is open
    const gig = await db.gig.findUnique({
      where: { id: params.gigId },
      select: { status: true, clientId: true }
    });

    if (!gig) {
      return new NextResponse("Gig not found", { status: 404 });
    }

    if (gig.status !== "OPEN") {
      return new NextResponse("Gig is not accepting proposals", { status: 400 });
    }

    if (gig.clientId === session.user.id) {
      return new NextResponse("Cannot submit proposal to own gig", { status: 400 });
    }

    // Check if user has already submitted a proposal
    const existingProposal = await db.proposal.findFirst({
      where: {
        gigId: params.gigId,
        userId: session.user.id
      }
    });

    if (existingProposal) {
      return new NextResponse("Already submitted a proposal", { status: 400 });
    }

    // Create the proposal
    const proposal = await db.proposal.create({
      data: {
        coverLetter: body.coverLetter,
        timeline: body.timeline,
        price: body.price,
        userId: session.user.id,
        gigId: params.gigId,
        portfolioId: body.portfolioId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        portfolio: true
      }
    });

    // Notify the client about new proposal
    // TODO: Add notification logic here

    return NextResponse.json(proposal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { gigId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the gig
    const gig = await db.gig.findUnique({
      where: { id: params.gigId },
      select: { clientId: true }
    });

    if (!gig) {
      return new NextResponse("Gig not found", { status: 404 });
    }

    // Only allow client to view all proposals
    const isClient = gig.clientId === session.user.id;

    const proposals = await db.proposal.findMany({
      where: {
        gigId: params.gigId,
        ...(isClient ? {} : { userId: session.user.id })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        portfolio: {
          select: {
            title: true,
            images: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(proposals);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
} 