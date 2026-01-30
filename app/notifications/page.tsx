import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import NotificationForm from "@/components/NotificationForm";

export default async function NotificationsPage() {
  const user = await getSessionUser();
  if (!user || user.subscriptionStatus !== "active") {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow">
      <h1 className="text-2xl font-semibold text-plum">Notifications</h1>
      <p className="mt-2 text-sm text-plum/70">Opt in to receive new content alerts.</p>
      <NotificationForm initialOptIn={user.notificationPreference?.optedIn ?? false} />
    </div>
  );
}
