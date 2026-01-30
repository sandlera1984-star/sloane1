import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { createMagicToken } from "@/lib/magic";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const title = formData.get("title")?.toString();
  const type = formData.get("type")?.toString();
  const file = formData.get("file") as File | null;
  const thumbnail = formData.get("thumbnail") as File | null;
  const isLocked = formData.get("isLocked") === "on";
  const publish = formData.get("publish") === "on";
  const sendNotification = formData.get("sendNotification") === "on";

  if (!title || !type || !file || !thumbnail) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const mediaBlob = await put(`content/${Date.now()}-${file.name}`, file, {
    access: "private"
  });
  const thumbnailBlob = await put(`thumbnails/${Date.now()}-${thumbnail.name}`, thumbnail, {
    access: "public"
  });

  const content = await prisma.content.create({
    data: {
      title,
      type: type === "video" ? "video" : "photo",
      mediaUrl: mediaBlob.url,
      thumbnailUrl: thumbnailBlob.url,
      isLocked,
      publishedAt: publish ? new Date() : null
    }
  });

  if (publish && sendNotification) {
    const subscribers = await prisma.user.findMany({
      where: {
        subscriptionStatus: "active",
        notificationPreference: { is: { optedIn: true } }
      }
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";

    await Promise.all(
      subscribers.map(async (subscriber) => {
        const token = await createMagicToken(subscriber.id);
        await sendEmail({
          to: subscriber.email,
          subject: "New content released",
          html: `
            <p>New exclusive content released today view now!</p>
            <p><a href="${baseUrl}/magic?token=${token}">View exclusive content</a></p>
          `
        });
      })
    );
  }

  return NextResponse.json({ success: true, id: content.id });
}
