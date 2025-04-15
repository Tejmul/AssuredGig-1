import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth.config"
import { z } from "zod"
import Razorpay from "razorpay"
import type { Session } from "next-auth"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Validation schemas
const paymentSchema = z.object({
  contractId: z.string(),
  amount: z.number().min(1, "Amount must be at least 1"),
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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const data = paymentSchema.parse(body);

    // Check if contract exists and user is the client
    const contract = await db.contract.findUnique({
      where: { id: data.contractId },
      include: {
        client: true,
        freelancer: true,
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    if (contract.clientId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the client can make payments" },
        { status: 403 }
      );
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: data.amount * 100, // Convert to paise
      currency: "INR",
      receipt: `contract_${contract.id}`,
    });

    // Create payment record
    const payment = await db.payment.create({
      data: {
        contractId: contract.id,
        clientId: session.user.id,
        amount: data.amount,
        orderId: order.id,
      },
    });

    return NextResponse.json({
      payment,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return handleApiError(error);
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const contractId = searchParams.get("contractId");
    
    if (!contractId) {
      return NextResponse.json(
        { error: "Contract ID is required" },
        { status: 400 }
      );
    }
    
    // Check if contract exists and user is part of it
    const contract = await db.contract.findUnique({
      where: { id: contractId },
      include: {
        client: true,
        freelancer: true,
      },
    });
    
    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }
    
    if (contract.clientId !== session.user.id && contract.freelancerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Get payments
    const payments = await db.payment.findMany({
      where: { contractId },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 