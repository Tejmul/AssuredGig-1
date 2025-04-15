import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(
  req: Request,
  { params }: { params: { contractId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { amount, currency = "usd" } = await req.json();

    // Validate contract exists and user has access
    const contract = await db.contract.findUnique({
      where: { id: params.contractId },
      include: {
        client: true,
        freelancer: true,
      },
    });

    if (!contract) {
      return new NextResponse("Contract not found", { status: 404 });
    }

    if (contract.clientId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        contractId: contract.id,
        clientId: contract.clientId,
        freelancerId: contract.freelancerId,
      },
    });

    // Create payment record
    const payment = await db.payment.create({
      data: {
        amount,
        currency,
        status: "pending",
        contractId: contract.id,
        clientId: contract.clientId,
        freelancerId: contract.freelancerId,
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error("[PAYMENT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { contractId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const contract = await db.contract.findUnique({
      where: { id: params.contractId },
      include: {
        client: true,
        freelancer: true,
      },
    });

    if (!contract) {
      return new NextResponse("Contract not found", { status: 404 });
    }

    if (contract.clientId !== session.user.id && contract.freelancerId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const payments = await db.payment.findMany({
      where: { contractId: params.contractId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("[PAYMENT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 