"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar } from "@/components/avatar";
import { signOutAction } from "@/lib/actions/sign-out";
import { cn } from "@/lib/utils";

type NavUser = {
  name?: string | null;
  image?: string | null;
  username?: string | null;
} | null;

export function NavbarClient({
  user,
  navLinks,
}: {
  user: NavUser;
  navLinks: { href: string; label: string }[];
}) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const [renderedPathname, setRenderedPathname] = React.useState(pathname);

  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    setOpen(false);
  }

  return (
    <>
      <nav className="hidden items-center gap-8 md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-black/70 transition-colors hover:text-black dark:text-white/70 dark:hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="hidden items-center gap-3 md:flex">
        <ThemeToggle />
        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Avatar name={user.name} src={user.image} size={32} />
            </Link>
            <form action={signOutAction}>
              <Button variant="ghost" size="icon" aria-label="Se déconnecter">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        ) : (
          <>
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              Connexion
            </Link>
            <Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
              S&apos;inscrire
            </Link>
          </>
        )}
      </div>

      <button
        className="flex h-10 w-10 items-center justify-center rounded-full md:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute left-0 top-16 w-full overflow-hidden border-b border-black/5 bg-white/95 backdrop-blur-lg dark:border-white/10 dark:bg-black/95 md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-black/5 dark:bg-white/10" />
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5"
                    )}
                  >
                    <LayoutDashboard className="h-4 w-4" /> Tableau de bord
                  </Link>
                  <form action={signOutAction}>
                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5">
                      <LogOut className="h-4 w-4" /> Se déconnecter
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex gap-2 px-1 pt-2">
                  <Link
                    href="/login"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1")}
                  >
                    Connexion
                  </Link>
                  <Link href="/register" className={cn(buttonVariants({ size: "sm" }), "flex-1")}>
                    S&apos;inscrire
                  </Link>
                </div>
              )}
              <div className="flex justify-center pt-2">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
