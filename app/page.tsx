import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import ContentCard from "@/components/ContentCard";

const fallbackContent = [
  {
    id: "1",
    title: "Midnight Satin",
    thumbnailUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    isLocked: true
  },
  {
    id: "2",
    title: "Studio Glow",
    thumbnailUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
    isLocked: false
  },
  {
    id: "3",
    title: "Velvet Hour",
    thumbnailUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    isLocked: true
  }
];

export default async function HomePage() {
  const content = await prisma.content.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { createdAt: "desc" },
    take: 6
  });
  const items = content.length ? content : fallbackContent;

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl bg-white shadow-lg">
        <div className="relative h-64 w-full">
          <Image
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80"
            alt="Banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-plum/70 via-rose/40 to-transparent" />
        </div>
        <div className="absolute left-1/2 top-36 h-32 w-32 -translate-x-1/2 overflow-hidden rounded-full border-4 border-white shadow-xl">
          <Image
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80"
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <div className="pb-10 pt-20 text-center">
          <h1 className="text-3xl font-semibold text-plum">Luxury looks, members-only drops</h1>
          <p className="mt-2 text-plum/70">Subscribe to unlock exclusive fashion edits, behind-the-scenes, and premium releases.</p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/pay"
              className="rounded-full bg-plum px-6 py-3 text-sm font-semibold text-white"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-plum px-6 py-3 text-sm font-semibold text-plum"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-plum">Preview the drop</h2>
          <p className="text-sm text-plum/60">Locked posts are blurred for non-members.</p>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              thumbnailUrl={item.thumbnailUrl}
              isLocked={item.isLocked}
              canView={false}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
