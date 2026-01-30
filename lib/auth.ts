import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";
import { addHours, isBefore } from "date-fns";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = "exclusive_session";

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = addHours(new Date(), 24 * 7);
  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt
    }
  });
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt
  });
}

export async function destroySession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
    cookies().delete(SESSION_COOKIE);
  }
}

export async function getSessionUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: { include: { notificationPreference: true } } }
  });
  if (!session) return null;
  if (isBefore(session.expiresAt, new Date())) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }
  return session.user;
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}
