import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import ContentGallery from "@/components/ContentGallery";
import MemberSidebar from "@/components/MemberSidebar";

export default async function ExclusivePage() {
  const user = await getSessionUser();
  const isSubscribed = user?.subscriptionStatus === "active";

  const content = await prisma.content.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { createdAt: "desc" }
  });

  const items = content.map((item) => ({
    id: item.id,
    title: item.title,
    type: item.type,
    mediaUrl: item.isLocked ? `/api/media/${item.id}` : item.mediaUrl,
    thumbnailUrl: item.thumbnailUrl,
    isLocked: item.isLocked
  }));

  if (!user || !isSubscribed) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow">
          <h1 className="text-2xl font-semibold text-plum">Unlock the full vault</h1>
          <p className="mt-2 text-sm text-plum/70">Subscribe to access members-only photos and videos.</p>
          <Link
            href="/pay"
            className="mt-4 inline-block rounded-full bg-plum px-6 py-3 text-sm font-semibold text-white"
          >
            Become a member
          </Link>
        </div>
        <ContentGallery items={items} canViewLocked={false} />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <MemberSidebar />
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow">
          <h1 className="text-2xl font-semibold text-plum">Welcome back</h1>
          <p className="mt-2 text-sm text-plum/70">Enjoy full-res access to every drop.</p>
        </div>
        <ContentGallery items={items} canViewLocked />
      </div>
    </div>
  );
}
