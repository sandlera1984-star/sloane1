import Link from "next/link";

export default function MemberSidebar() {
  return (
    <aside className="w-full max-w-xs space-y-4 rounded-3xl bg-white p-6 shadow">
      <h2 className="text-lg font-semibold text-plum">Member Menu</h2>
      <nav className="space-y-2 text-sm text-plum">
        <Link href="/account/subscription" className="block rounded-xl px-3 py-2 hover:bg-cream">
          Subscription
        </Link>
        <Link href="/account/support" className="block rounded-xl px-3 py-2 hover:bg-cream">
          Support
        </Link>
      </nav>
    </aside>
  );
}
