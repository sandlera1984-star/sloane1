import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  const { subscriptionId } = await request.json();
  if (!subscriptionId) {
    return NextResponse.json({ error: "Missing subscriptionId." }, { status: 400 });
  }

  const user = await getSessionUser();
  if (!user || user.stripeSubscriptionId !== subscriptionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await stripe.subscriptions.cancel(subscriptionId);
  await prisma.user.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: { subscriptionStatus: "canceled" }
  });

  return NextResponse.json({ success: true });
}
