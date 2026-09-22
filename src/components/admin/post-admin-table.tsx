"use client";

import * as React from "react";
import { useTransition } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { deletePostAsAdminAction } from "@/lib/actions/admin";
import { formatDate } from "@/lib/utils";

type AdminPost = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: Date;
  author: { name: string | null; username: string | null };
};

export function PostAdminTable({ posts }: { posts: AdminPost[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | null>(null);

  if (posts.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-black/10 p-8 text-center text-sm text-black/50 dark:border-white/15 dark:text-white/50">
        Aucun article pour le moment.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 dark:border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-black/[0.03] text-left text-xs uppercase tracking-wide text-black/50 dark:bg-white/[0.03] dark:text-white/50">
          <tr>
            <th className="px-4 py-3">Article</th>
            <th className="px-4 py-3">Auteur</th>
            <th className="px-4 py-3">Statut</th>
            <th className="px-4 py-3">Créé le</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5 dark:divide-white/10">
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="px-4 py-3">
                <Link href={`/blog/${post.slug}`} className="font-medium hover:underline">
                  {post.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-black/60 dark:text-white/60">
                {post.author.name ?? `@${post.author.username}`}
              </td>
              <td className="px-4 py-3">
                <Badge variant={post.published ? "default" : "outline"}>
                  {post.published ? "Publié" : "Brouillon"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-black/60 dark:text-white/60">{formatDate(post.createdAt)}</td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    setError(null);
                    if (!confirm(`Supprimer l'article "${post.title}" ? Cette action est irréversible.`)) return;
                    startTransition(async () => {
                      await deletePostAsAdminAction(post.id).catch(() =>
                        setError("Une erreur est survenue.")
                      );
                    });
                  }}
                  className="rounded-full p-2 text-red-500 hover:bg-red-500/10"
                  aria-label="Supprimer l'article"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <p className="px-4 py-3 text-sm text-red-500">{error}</p>}
    </div>
  );
}
