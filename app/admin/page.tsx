import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AdminContentForm from "@/components/AdminContentForm";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow">
      <h1 className="text-2xl font-semibold text-plum">Admin upload</h1>
      <p className="mt-2 text-sm text-plum/70">Upload new photos or videos and publish to members.</p>
      <AdminContentForm />
    </div>
  );
}
