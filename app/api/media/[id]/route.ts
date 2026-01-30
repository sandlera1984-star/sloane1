import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const content = await prisma.content.findUnique({
    where: { id: params.id }
  });

  if (!content) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (content.isLocked) {
    const user = await getSessionUser();
    if (!user || user.subscriptionStatus !== "active") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) {
    return NextResponse.json({ error: "Missing blob token." }, { status: 500 });
  }

  const blobResponse = await fetch(content.mediaUrl, {
    headers: {
      Authorization: `Bearer ${blobToken}`
    }
  });

  if (!blobResponse.ok || !blobResponse.body) {
    return NextResponse.json({ error: "Unable to fetch media." }, { status: 502 });
  }

  return new Response(blobResponse.body, {
    headers: {
      "Content-Type": blobResponse.headers.get("Content-Type") || "application/octet-stream",
      "Cache-Control": "private, max-age=60"
    }
  });
}
