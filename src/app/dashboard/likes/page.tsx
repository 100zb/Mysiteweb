import type { Metadata } from "next";
import { auth } from "@/auth";
import { getLikedPostsForUser } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export const metadata: Metadata = { title: "Articles aimés" };

export default async function LikedPostsPage() {
  const session = await auth();
  const posts = await getLikedPostsForUser(session!.user.id);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Articles aimés</h1>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        {posts.length} article{posts.length !== 1 ? "s" : ""} que tu as aimé{posts.length !== 1 ? "s" : ""}
      </p>

      {posts.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-black/10 p-12 text-center text-black/50 dark:border-white/15 dark:text-white/50">
          Tu n&apos;as encore aimé aucun article. Va explorer le{" "}
          <a href="/blog" className="text-violet-600 hover:underline dark:text-violet-400">
            blog
          </a>
          !
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
