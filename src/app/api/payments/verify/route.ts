import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyPayment } from "@/lib/razorpay"
import { z } from "zod"

// Validation schema for webhook payload
const webhookSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = webhookSchema.parse(body);

    // Verify the payment signature
    const isValid = verifyPayment(
      data.razorpay_order_id,
      data.razorpay_payment_id,
      data.razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Find the payment record
    const payment = await db.payment.findFirst({
      where: { orderId: data.razorpay_order_id },
      include: {
        contract: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 }
      );
    }

    // Update the payment status
    await db.payment.update({
      where: { id: payment.id },
      data: {
        status: "COMPLETED",
        paymentId: data.razorpay_payment_id,
        completedAt: new Date(),
      },
    });

    // If this is the first payment (advance), update the contract status
    if (payment.contract.status === "PENDING") {
      await db.contract.update({
        where: { id: payment.contract.id },
        data: { status: "ACTIVE" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PAYMENT_VERIFICATION_ERROR]", error);
    
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
  }
} 