import Link from "next/link";
import { auth } from "@/auth";
import { NavbarClient } from "@/components/layout/navbar-client";

const navLinks = [
  { href: "/blog", label: "Articles" },
  { href: "/blog?category=all", label: "Catégories" },
];

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-lg dark:border-white/10 dark:bg-black/50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Nova<span className="text-violet-500">.</span>
        </Link>
        <NavbarClient user={session?.user ?? null} navLinks={navLinks} />
      </div>
    </header>
  );
}
