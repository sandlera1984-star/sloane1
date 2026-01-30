import { prisma } from "@/lib/db";
import { addMinutes, isBefore } from "date-fns";
import { randomBytes } from "crypto";

export async function createMagicToken(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = addMinutes(new Date(), 15);
  await prisma.magicToken.create({
    data: {
      userId,
      token,
      expiresAt
    }
  });
  return token;
}

export async function verifyMagicToken(token: string) {
  const record = await prisma.magicToken.findUnique({
    where: { token },
    include: { user: true }
  });
  if (!record) return null;
  if (record.usedAt || isBefore(record.expiresAt, new Date())) {
    return null;
  }
  await prisma.magicToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() }
  });
  return record.user;
}
