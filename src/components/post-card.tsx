import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle, Clock } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { PostCard as PostCardType } from "@/lib/posts";

export function PostCard({ post }: { post: PostCardType }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 dark:border-white/10 dark:bg-white/[0.03]"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {post.category && (
          <div className="absolute left-3 top-3">
            <Badge variant="solid">{post.category.name}</Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 text-lg font-semibold tracking-tight group-hover:text-violet-600 dark:group-hover:text-violet-400">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="line-clamp-2 text-sm text-black/60 dark:text-white/60">{post.excerpt}</p>
        )}

        <div className="mt-auto flex items-center gap-2 pt-2">
          <Avatar name={post.author.name} src={post.author.image} size={28} />
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-medium">{post.author.name ?? post.author.username}</span>
            {post.publishedAt && (
              <span className="text-xs text-black/40 dark:text-white/40">
                {formatDate(post.publishedAt)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-black/5 pt-3 text-xs text-black/50 dark:border-white/10 dark:text-white/50">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {post.readingTime} min
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" /> {post._count.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" /> {post._count.comments}
          </span>
        </div>
      </div>
    </Link>
  );
}
