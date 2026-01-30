import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

const statusMap: Record<string, "active" | "past_due" | "canceled"> = {
  active: "active",
  past_due: "past_due",
  canceled: "canceled",
  unpaid: "past_due"
};

export async function POST(request: Request) {
  const { email, password, subscriptionId } = await request.json();
  if (!email || !password || !subscriptionId) {
    return NextResponse.json({ error: "Missing registration fields." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered." }, { status: 400 });
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const status = statusMap[subscription.status] ?? "canceled";

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: status
    }
  });

  await createSession(user.id);

  return NextResponse.json({ success: true });
}
