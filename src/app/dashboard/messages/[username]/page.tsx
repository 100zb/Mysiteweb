import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getUserByUsername } from "@/lib/posts";
import { areMutualFollowers } from "@/lib/social";
import { getMessages, markMessagesRead } from "@/lib/messages";
import { Avatar } from "@/components/avatar";
import { MessageThread } from "@/components/dashboard/message-thread";

export async function generateMetadata({
  params,
}: PageProps<"/dashboard/messages/[username]">): Promise<Metadata> {
  const { username } = await params;
  const user = await getUserByUsername(username);
  return { title: user ? `Messages — ${user.name}` : "Messages" };
}

export default async function MessageThreadPage({
  params,
}: PageProps<"/dashboard/messages/[username]">) {
  const { username } = await params;
  const session = await auth();
  const currentUserId = session!.user.id;

  const other = await getUserByUsername(username);
  if (!other) notFound();
  if (other.id === currentUserId) notFound();

  const mutual = await areMutualFollowers(currentUserId, other.id);
  if (!mutual) {
    return (
      <div>
        <Link href="/dashboard/messages" className="text-sm text-violet-600 hover:underline dark:text-violet-400">
          ← Messages
        </Link>
        <div className="mt-6 rounded-2xl border border-dashed border-black/10 p-12 text-center text-black/50 dark:border-white/15 dark:text-white/50">
          Vous devez vous suivre mutuellement avec @{username} pour échanger des messages.
        </div>
      </div>
    );
  }

  await markMessagesRead(currentUserId, other.id);
  const messages = await getMessages(currentUserId, other.id);

  return (
    <div>
      <Link href="/dashboard/messages" className="text-sm text-violet-600 hover:underline dark:text-violet-400">
        ← Messages
      </Link>
      <div className="mt-3 mb-5 flex items-center gap-3">
        <Avatar name={other.name} src={other.image} size={40} />
        <div>
          <p className="font-semibold">{other.name}</p>
          <p className="text-xs text-black/50 dark:text-white/50">@{other.username}</p>
        </div>
      </div>

      <MessageThread
        currentUserId={currentUserId}
        otherUserId={other.id}
        otherUsername={other.username!}
        messages={messages}
      />
    </div>
  );
}
