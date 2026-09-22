"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, PlusCircle, UserCog, ShieldCheck, Heart, Mail } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { cn } from "@/lib/utils";

const baseLinks = [
  { href: "/dashboard", label: "Mes articles", icon: LayoutGrid },
  { href: "/dashboard/new", label: "Nouvel article", icon: PlusCircle },
  { href: "/dashboard/likes", label: "Articles aimés", icon: Heart },
  { href: "/dashboard/messages", label: "Messages", icon: Mail },
  { href: "/dashboard/profile", label: "Profil", icon: UserCog },
];

const adminLink = { href: "/dashboard/admin", label: "Administration", icon: ShieldCheck };

export function DashboardSidebar({
  user,
  unreadMessages = 0,
}: {
  user: { name?: string | null; username?: string | null; image?: string | null; role?: string };
  unreadMessages?: number;
}) {
  const pathname = usePathname();
  const links = user.role === "ADMIN" ? [...baseLinks, adminLink] : baseLinks;

  return (
    <aside className="lg:w-64">
      <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <Avatar name={user.name} src={user.image} size={44} />
        <div>
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-black/50 dark:text-white/50">@{user.username}</p>
        </div>
      </div>

      <nav className="mt-4 flex gap-1 overflow-x-auto rounded-2xl border border-black/5 bg-white/60 p-2 dark:border-white/10 dark:bg-white/[0.03] lg:flex-col lg:overflow-visible">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white"
                  : "hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              <link.icon className="h-4 w-4" /> {link.label}
              {link.href === "/dashboard/messages" && unreadMessages > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-fuchsia-500 px-1.5 text-[11px] font-semibold text-white">
                  {unreadMessages > 9 ? "9+" : unreadMessages}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
