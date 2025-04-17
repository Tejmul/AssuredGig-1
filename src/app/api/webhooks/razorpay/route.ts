import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPayment } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const signature = headers().get("x-razorpay-signature")!;

    // Verify the webhook signature
    const isValid = verifyPayment(
      body.payload.payment.entity.order_id,
      body.payload.payment.entity.id,
      signature
    );

    if (!isValid) {
      console.error("[RAZORPAY_WEBHOOK_ERROR]", "Invalid signature");
      return new NextResponse("Webhook Error", { status: 400 });
    }

    const payment = body.payload.payment.entity;

    if (payment.status === "captured") {
      const dbPayment = await db.payment.findFirst({
        where: { razorpayOrderId: payment.order_id },
      });

      if (dbPayment) {
        await db.payment.update({
          where: { id: dbPayment.id },
          data: { 
            status: "completed",
            razorpayPaymentId: payment.id,
          },
        });

        // Update contract status if needed
        const contract = await db.contract.findUnique({
          where: { id: dbPayment.contractId },
        });

        if (contract) {
          await db.contract.update({
            where: { id: contract.id },
            data: { status: "in_progress" },
          });
        }
      }
    }

    if (payment.status === "failed") {
      const dbPayment = await db.payment.findFirst({
        where: { razorpayOrderId: payment.order_id },
      });

      if (dbPayment) {
        await db.payment.update({
          where: { id: dbPayment.id },
          data: { 
            status: "failed",
            razorpayPaymentId: payment.id,
          },
        });
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("[RAZORPAY_WEBHOOK]", error);
    return new NextResponse("Webhook Error", { status: 400 });
  }
} 