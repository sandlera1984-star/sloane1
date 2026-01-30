import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import SupportForm from "@/components/SupportForm";

export default async function SupportPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow">
      <h1 className="text-2xl font-semibold text-plum">Support</h1>
      <p className="mt-2 text-sm text-plum/70">Tell us how we can help.</p>
      <SupportForm email={user.email} name={user.name || ""} />
    </div>
  );
}
