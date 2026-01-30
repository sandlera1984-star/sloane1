import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { optedIn } = await request.json();

  await prisma.notificationPreference.upsert({
    where: { userId: user.id },
    update: { optedIn: Boolean(optedIn) },
    create: { userId: user.id, optedIn: Boolean(optedIn) }
  });

  return NextResponse.json({ success: true });
}
