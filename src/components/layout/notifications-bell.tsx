"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, UserPlus, FileText, Mail } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { markAllNotificationsRead } from "@/lib/actions/notifications";
import { formatRelativeTime, cn } from "@/lib/utils";

type NotificationItem = {
  id: string;
  type: "FOLLOW" | "NEW_POST" | "MESSAGE";
  read: boolean;
  createdAt: string;
  actor: { name: string | null; username: string | null; image: string | null } | null;
  post: { title: string; slug: string } | null;
};

const POLL_INTERVAL = 20_000;

function notificationHref(n: NotificationItem): string {
  if (n.type === "NEW_POST" && n.post) return `/blog/${n.post.slug}`;
  if (n.type === "MESSAGE" && n.actor?.username) return `/dashboard/messages/${n.actor.username}`;
  if (n.actor?.username) return `/profile/${n.actor.username}`;
  return "#";
}

function notificationText(n: NotificationItem): string {
  const name = n.actor?.name ?? "Quelqu'un";
  if (n.type === "FOLLOW") return `${name} s'est abonné à toi.`;
  if (n.type === "NEW_POST") return `${name} a publié « ${n.post?.title ?? "un article"} ».`;
  return `${name} t'a envoyé un message.`;
}

const iconByType = { FOLLOW: UserPlus, NEW_POST: FileText, MESSAGE: Mail };

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/notifications", { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        setUnreadCount(data.unreadCount);
        setItems(data.items);
      } catch {
        // ignore transient network errors, next poll will retry
      }
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleOpen() {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) {
      setUnreadCount(0);
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      await markAllNotificationsRead();
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <Button variant="ghost" size="icon" aria-label="Notifications" onClick={handleOpen}>
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-fuchsia-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 max-w-[90vw] rounded-2xl border border-black/10 bg-white shadow-xl dark:border-white/10 dark:bg-neutral-900">
          <div className="border-b border-black/5 px-4 py-3 text-sm font-semibold dark:border-white/10">
            Notifications
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-black/50 dark:text-white/50">
                Pas encore de notifications.
              </p>
            ) : (
              items.map((n) => {
                const Icon = iconByType[n.type];
                return (
                  <Link
                    key={n.id}
                    href={notificationHref(n)}
                    className={cn(
                      "flex items-start gap-3 border-b border-black/5 px-4 py-3 text-sm transition-colors last:border-b-0 hover:bg-black/5 dark:border-white/5 dark:hover:bg-white/5",
                      !n.read && "bg-violet-50 dark:bg-violet-500/10"
                    )}
                  >
                    <Avatar name={n.actor?.name} src={n.actor?.image} size={32} />
                    <span className="flex-1">
                      <span className="flex items-center gap-1.5 text-black/80 dark:text-white/80">
                        <Icon className="h-3.5 w-3.5 shrink-0 text-violet-500" />
                        {notificationText(n)}
                      </span>
                      <span className="mt-0.5 block text-xs text-black/40 dark:text-white/40">
                        {formatRelativeTime(n.createdAt)}
                      </span>
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
