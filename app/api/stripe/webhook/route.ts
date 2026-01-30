import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

const statusMap: Record<string, "active" | "past_due" | "canceled"> = {
  active: "active",
  past_due: "past_due",
  canceled: "canceled",
  unpaid: "past_due"
};

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing Stripe webhook secret." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { subscriptionStatus: statusMap[subscription.status] ?? "canceled" }
      });
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        await prisma.user.updateMany({
          where: { stripeSubscriptionId: invoice.subscription as string },
          data: { subscriptionStatus: "active" }
        });
      }
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        await prisma.user.updateMany({
          where: { stripeSubscriptionId: invoice.subscription as string },
          data: { subscriptionStatus: "past_due" }
        });
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
