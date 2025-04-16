import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const progressSchema = z.object({
  description: z.string().min(10),
  percentage: z.number().min(0).max(100),
  files: z.array(z.string()).optional()
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

    // Get the gig and verify freelancer
    const gig = await db.gig.findUnique({
      where: { id: params.gigId },
      include: {
        selectedProposal: {
          select: { userId: true }
        }
      }
    });

    if (!gig) {
      return new NextResponse("Gig not found", { status: 404 });
    }

    // Ensure only the selected freelancer can update progress
    if (gig.selectedProposal?.userId !== session.user.id) {
      return new NextResponse("Not authorized", { status: 403 });
    }

    const json = await req.json();
    const body = progressSchema.parse(json);

    // Create progress update
    const progress = await db.progress.create({
      data: {
        gigId: gig.id,
        description: body.description,
        percentage: body.percentage,
        files: body.files ? JSON.stringify(body.files) : null
      }
    });

    // If progress is 100%, notify client for final payment
    if (body.percentage === 100) {
      // TODO: Implement notification system
      // Notify client that project is complete and ready for review
    }

    return NextResponse.json(progress);
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
      include: {
        selectedProposal: {
          select: { userId: true }
        }
      }
    });

    if (!gig) {
      return new NextResponse("Gig not found", { status: 404 });
    }

    // Only allow client and selected freelancer to view progress
    if (gig.clientId !== session.user.id && gig.selectedProposal?.userId !== session.user.id) {
      return new NextResponse("Not authorized", { status: 403 });
    }

    const progress = await db.progress.findMany({
      where: {
        gigId: gig.id
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(progress);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
} 