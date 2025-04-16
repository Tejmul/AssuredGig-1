import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Razorpay from "razorpay";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(
  req: Request,
  { params }: { params: { gigId: string; proposalId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the gig and proposal
    const gig = await db.gig.findUnique({
      where: { id: params.gigId },
      include: {
        proposals: {
          where: { id: params.proposalId },
          include: { user: true }
        }
      }
    });

    if (!gig) {
      return new NextResponse("Gig not found", { status: 404 });
    }

    if (gig.clientId !== session.user.id) {
      return new NextResponse("Not authorized", { status: 403 });
    }

    if (gig.status !== "OPEN") {
      return new NextResponse("Gig is not open", { status: 400 });
    }

    const proposal = gig.proposals[0];
    if (!proposal) {
      return new NextResponse("Proposal not found", { status: 404 });
    }

    // Calculate advance payment (50% of proposal price)
    const advanceAmount = proposal.price * 0.5;

    // Create Razorpay order for advance payment
    const order = await razorpay.orders.create({
      amount: Math.round(advanceAmount * 100), // Convert to smallest currency unit
      currency: "INR",
      notes: {
        gigId: gig.id,
        proposalId: proposal.id,
        type: "ADVANCE"
      }
    });

    // Update gig status and selected proposal
    await db.gig.update({
      where: { id: gig.id },
      data: {
        status: "IN_PROGRESS",
        selectedProposalId: proposal.id
      }
    });

    // Create payment record
    const payment = await db.payment.create({
      data: {
        amount: advanceAmount,
        type: "ADVANCE",
        razorpayId: order.id,
        userId: session.user.id,
        freelancerId: proposal.userId
      }
    });

    // Create initial progress record
    await db.progress.create({
      data: {
        gigId: gig.id,
        description: "Project initiated",
        percentage: 0
      }
    });

    // Return payment details
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment.id
    });
  } catch (error) {
    console.error("Error selecting proposal:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 