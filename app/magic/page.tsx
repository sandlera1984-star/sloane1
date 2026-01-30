import { redirect } from "next/navigation";
import { createSession } from "@/lib/auth";
import { verifyMagicToken } from "@/lib/magic";

export default async function MagicPage({
  searchParams
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;
  if (!token) {
    redirect("/login");
  }

  const user = await verifyMagicToken(token);
  if (!user || user.subscriptionStatus !== "active") {
    redirect("/login");
  }

  await createSession(user.id);
  redirect("/exclusive");
}
