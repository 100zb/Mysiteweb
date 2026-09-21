import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserByUsername, getUserPublishedPosts } from "@/lib/posts";
import { Avatar } from "@/components/avatar";
import { PostCard } from "@/components/post-card";
import { FadeIn } from "@/components/motion/fade-in";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps<"/profile/[username]">): Promise<Metadata> {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) return {};
  return { title: user.name ?? `@${user.username}` };
}

export default async function ProfilePage({ params }: PageProps<"/profile/[username]">) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) notFound();

  const posts = await getUserPublishedPosts(user.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <FadeIn className="flex flex-col items-center text-center">
        <Avatar name={user.name} src={user.image} size={96} />
        <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
        <p className="text-black/50 dark:text-white/50">@{user.username}</p>
        {user.bio && <p className="mt-3 max-w-md text-black/70 dark:text-white/70">{user.bio}</p>}
        <p className="mt-2 text-xs text-black/40 dark:text-white/40">
          Membre depuis {formatDate(user.createdAt)}
        </p>

        <div className="mt-6 flex gap-8 text-sm">
          <div className="text-center">
            <p className="font-semibold">{user._count.posts}</p>
            <p className="text-black/50 dark:text-white/50">Articles</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">{user._count.followers}</p>
            <p className="text-black/50 dark:text-white/50">Abonnés</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">{user._count.following}</p>
            <p className="text-black/50 dark:text-white/50">Abonnements</p>
          </div>
        </div>
      </FadeIn>

      <div className="mt-14">
        <h2 className="text-xl font-semibold">Articles publiés</h2>
        {posts.length === 0 ? (
          <p className="mt-4 text-black/50 dark:text-white/50">Aucun article publié pour le moment.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
