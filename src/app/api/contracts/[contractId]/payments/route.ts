import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createOrder } from "@/lib/razorpay";

export async function POST(
  req: Request,
  { params }: { params: { contractId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { amount, currency = "INR" } = await req.json();

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

    // Create Razorpay order
    const order = await createOrder(amount, currency);

    // Create payment record
    const payment = await db.payment.create({
      data: {
        amount,
        currency,
        status: "pending",
        contractId: contract.id,
        clientId: contract.clientId,
        freelancerId: contract.freelancerId,
        razorpayOrderId: order.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      paymentId: payment.id,
      keyId: process.env.RAZORPAY_KEY_ID,
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
      where: {
        contractId: contract.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("[PAYMENT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 