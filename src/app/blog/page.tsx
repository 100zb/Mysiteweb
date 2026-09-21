import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getPublishedPosts, getCategories } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { SearchBar } from "@/components/search-bar";
import { Pagination } from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Articles",
  description: "Explore tous les articles publiés par la communauté Nova.",
};

export default async function BlogPage({
  searchParams,
}: PageProps<"/blog">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;
  const tag = typeof params.tag === "string" ? params.tag : undefined;
  const page = Number(params.page) > 0 ? Number(params.page) : 1;

  const [{ posts, pageCount, total }, categories] = await Promise.all([
    getPublishedPosts({ q, category, tag, page }),
    getCategories(),
  ]);

  const buildHref = (p: number) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (category) sp.set("category", category);
    if (tag) sp.set("tag", tag);
    if (p > 1) sp.set("page", String(p));
    const query = sp.toString();
    return `/blog${query ? `?${query}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <FadeIn>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Articles</h1>
        <p className="mt-2 text-black/60 dark:text-white/60">
          {total} article{total > 1 ? "s" : ""} publié{total > 1 ? "s" : ""} par la communauté.
        </p>
      </FadeIn>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto]">
        <Suspense fallback={<div className="h-11" />}>
          <SearchBar />
        </Suspense>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/blog">
            <Badge variant={!category ? "solid" : "outline"}>Tous</Badge>
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/blog?category=${c.slug}`}>
              <Badge variant={category === c.slug ? "solid" : "outline"}>{c.name}</Badge>
            </Link>
          ))}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="mt-24 text-center text-black/50 dark:text-white/50">
          Aucun article ne correspond à ta recherche.
        </div>
      ) : (
        <div
          className={cn(
            "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {posts.map((post, i) => (
            <FadeIn key={post.id} delay={Math.min(i, 5) * 0.05}>
              <PostCard post={post} />
            </FadeIn>
          ))}
        </div>
      )}

      <Pagination page={page} pageCount={pageCount} buildHref={buildHref} />
    </div>
  );
}
