import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, STRIPE_PRICE_ID } from "@/lib/stripe";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!STRIPE_PRICE_ID) {
    return NextResponse.json({ error: "Missing Stripe price configuration." }, { status: 500 });
  }

  const customer = await stripe.customers.create({
    email: email || undefined
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: STRIPE_PRICE_ID }],
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"]
  });

  const invoice = subscription.latest_invoice as Stripe.Invoice;
  const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

  return NextResponse.json({
    subscriptionId: subscription.id,
    clientSecret: paymentIntent.client_secret,
    email: customer.email
  });
}
