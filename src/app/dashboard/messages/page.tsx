import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { getConversations } from "@/lib/messages";
import { getMutualFollowers } from "@/lib/social";
import { Avatar } from "@/components/avatar";
import { formatRelativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [conversations, mutuals] = await Promise.all([
    getConversations(userId),
    getMutualFollowers(userId),
  ]);

  const conversationIds = new Set(conversations.map((c) => c.user.id));
  const newContacts = mutuals.filter((m) => !conversationIds.has(m.id));

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        Échange en privé avec les personnes que tu suis et qui te suivent aussi.
      </p>

      {conversations.length === 0 && newContacts.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-black/10 p-12 text-center text-black/50 dark:border-white/15 dark:text-white/50">
          Suis quelqu&apos;un qui te suit aussi pour pouvoir lui écrire.
        </div>
      )}

      {conversations.length > 0 && (
        <div className="mt-8 space-y-1">
          {conversations.map(({ user, lastMessage, unreadCount }) => (
            <Link
              key={user.id}
              href={`/dashboard/messages/${user.username}`}
              className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Avatar name={user.name} src={user.image} size={44} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <span className="shrink-0 text-xs text-black/40 dark:text-white/40">
                    {formatRelativeTime(lastMessage.createdAt)}
                  </span>
                </div>
                <p className="truncate text-sm text-black/60 dark:text-white/60">{lastMessage.content}</p>
              </div>
              {unreadCount > 0 && (
                <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-fuchsia-500 px-1.5 text-[11px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      {newContacts.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-black/60 dark:text-white/60">
            Démarrer une conversation
          </h2>
          <div className="mt-3 space-y-1">
            {newContacts.map((contact) => (
              <Link
                key={contact.id}
                href={`/dashboard/messages/${contact.username}`}
                className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              >
                <Avatar name={contact.name} src={contact.image} size={44} />
                <p className="text-sm font-semibold">{contact.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
