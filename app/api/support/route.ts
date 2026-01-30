import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email, message } = await request.json();
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  await prisma.supportTicket.create({
    data: {
      userId: user.id,
      name,
      email,
      message
    }
  });

  await sendEmail({
    to: "insanitybjones@gmail.com",
    subject: "New support request",
    html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`
  });

  return NextResponse.json({ success: true });
}
