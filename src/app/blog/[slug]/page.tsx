import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Eye } from "lucide-react";
import {
  getPostBySlug,
  incrementPostViews,
  getRelatedPosts,
  getPostComments,
} from "@/lib/posts";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { MarkdownContent } from "@/components/markdown-content";
import { LikeButton } from "@/components/like-button";
import { CommentSection } from "@/components/comment-section";
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/post-card";
import { FadeIn } from "@/components/motion/fade-in";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  const pathname = `/blog/${slug}`;
  const session = await auth();

  const [comments, relatedPosts, like] = await Promise.all([
    getPostComments(post.id),
    getRelatedPosts(post.id, post.categoryId, 3),
    session?.user
      ? prisma.like.findUnique({
          where: { postId_userId: { postId: post.id, userId: session.user.id } },
        })
      : Promise.resolve(null),
  ]);

  void incrementPostViews(post.id);

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <FadeIn>
        {post.category && (
          <Link href={`/blog?category=${post.category.slug}`}>
            <Badge variant="solid" className="mb-4">
              {post.category.name}
            </Badge>
          </Link>
        )}
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{post.title}</h1>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link href={`/profile/${post.author.username}`} className="flex items-center gap-3">
            <Avatar name={post.author.name} src={post.author.image} size={44} />
            <div>
              <p className="text-sm font-semibold">{post.author.name ?? post.author.username}</p>
              {post.publishedAt && (
                <p className="text-xs text-black/50 dark:text-white/50">
                  {formatDate(post.publishedAt)}
                </p>
              )}
            </div>
          </Link>
          <div className="flex items-center gap-4 text-sm text-black/50 dark:text-white/50">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {post.readingTime} min
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" /> {post.viewCount}
            </span>
          </div>
        </div>
      </FadeIn>

      {post.coverImage && (
        <FadeIn delay={0.1}>
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
          </div>
        </FadeIn>
      )}

      <FadeIn delay={0.15}>
        <MarkdownContent content={post.content} className="mt-10" />
      </FadeIn>

      {post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map(({ tag }) => (
            <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
              <Badge variant="outline">#{tag.name}</Badge>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center gap-3 border-y border-black/5 py-4 dark:border-white/10">
        <LikeButton
          postId={post.id}
          pathname={pathname}
          initialLiked={!!like}
          initialCount={post._count.likes}
          isAuthenticated={!!session?.user}
        />
      </div>

      {post.author.bio && (
        <div className="mt-10 rounded-2xl border border-black/5 bg-black/[0.02] p-6 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <Avatar name={post.author.name} src={post.author.image} size={48} />
            <div>
              <p className="font-semibold">{post.author.name}</p>
              <Link href={`/profile/${post.author.username}`} className="text-xs text-violet-600 hover:underline dark:text-violet-400">
                Voir le profil
              </Link>
            </div>
          </div>
          <p className="mt-3 text-sm text-black/70 dark:text-white/70">{post.author.bio}</p>
        </div>
      )}

      <div className="mt-14">
        <CommentSection
          postId={post.id}
          pathname={pathname}
          comments={comments}
          isAuthenticated={!!session?.user}
          currentUserId={session?.user?.id}
        />
      </div>

      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-semibold">Articles similaires</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((related) => (
              <PostCard key={related.id} post={related} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
