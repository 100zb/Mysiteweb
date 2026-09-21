import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { auth } from "@/auth";
import { getUserPosts } from "@/lib/posts";
import { PostList } from "@/components/dashboard/post-list";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Mes articles" };

export default async function DashboardPage() {
  const session = await auth();
  const posts = await getUserPosts(session!.user.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mes articles</h1>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            {posts.length} article{posts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/dashboard/new" className={cn(buttonVariants({ size: "sm" }))}>
          <PlusCircle className="h-4 w-4" /> Nouvel article
        </Link>
      </div>

      <div className="mt-8">
        <PostList posts={posts} />
      </div>
    </div>
  );
}
