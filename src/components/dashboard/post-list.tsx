"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Eye, Heart, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { togglePublish, deletePost } from "@/lib/actions/posts";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

type DashboardPost = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  publishedAt: Date | null;
  updatedAt: Date;
  viewCount: number;
  _count: { likes: number; comments: number };
};

export function PostList({ posts }: { posts: DashboardPost[] }) {
  const [isPending, startTransition] = useTransition();

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 p-12 text-center text-black/50 dark:border-white/15 dark:text-white/50">
        Tu n&apos;as pas encore écrit d&apos;article.{" "}
        <Link href="/dashboard/new" className="text-violet-600 hover:underline dark:text-violet-400">
          Commence maintenant
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white/60 p-5 dark:border-white/10 dark:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <Link href={`/blog/${post.slug}`} className="font-semibold hover:underline">
                {post.title}
              </Link>
              <Badge variant={post.published ? "default" : "outline"}>
                {post.published ? "Publié" : "Brouillon"}
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-black/50 dark:text-white/50">
              <span>
                {post.published && post.publishedAt
                  ? `Publié le ${formatDate(post.publishedAt)}`
                  : `Modifié le ${formatDate(post.updatedAt)}`}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> {post.viewCount}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" /> {post._count.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" /> {post._count.comments}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await togglePublish(post.id);
                })
              }
              className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5"
            >
              {post.published ? "Dépublier" : "Publier"}
            </button>
            <Link
              href={`/dashboard/${post.id}/edit`}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Modifier"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <button
              disabled={isPending}
              onClick={() => {
                if (confirm("Supprimer définitivement cet article ?")) {
                  startTransition(async () => {
                    await deletePost(post.id);
                  });
                }
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-500/10"
              aria-label="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
