import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error("[STRIPE_WEBHOOK_ERROR]", error);
      return new NextResponse("Webhook Error", { status: 400 });
    }

    const session = event.data.object as Stripe.PaymentIntent;

    if (event.type === "payment_intent.succeeded") {
      const payment = await db.payment.findFirst({
        where: { stripePaymentIntentId: session.id },
      });

      if (payment) {
        await db.payment.update({
          where: { id: payment.id },
          data: { status: "completed" },
        });

        // Update contract status if needed
        const contract = await db.contract.findUnique({
          where: { id: payment.contractId },
        });

        if (contract) {
          await db.contract.update({
            where: { id: contract.id },
            data: { status: "in_progress" },
          });
        }
      }
    }

    if (event.type === "payment_intent.payment_failed") {
      const payment = await db.payment.findFirst({
        where: { stripePaymentIntentId: session.id },
      });

      if (payment) {
        await db.payment.update({
          where: { id: payment.id },
          data: { status: "failed" },
        });
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("[STRIPE_WEBHOOK]", error);
    return new NextResponse("Webhook Error", { status: 400 });
  }
} 