import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import SubscriptionPanel from "@/components/SubscriptionPanel";

export default async function SubscriptionPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow">
      <h1 className="text-2xl font-semibold text-plum">Subscription</h1>
      <SubscriptionPanel status={user.subscriptionStatus} subscriptionId={user.stripeSubscriptionId} />
    </div>
  );
}
