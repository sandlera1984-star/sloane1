import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-rose/30 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold text-plum">
          Sloane Exclusive
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-plum">
          <Link href="/" className="hover:text-rose">Sign Up</Link>
          <Link href="/exclusive" className="hover:text-rose">Exclusive Content</Link>
          <Link href="/notifications" className="hover:text-rose">Notifications</Link>
        </nav>
      </div>
    </header>
  );
}
