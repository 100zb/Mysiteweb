"use client";

import * as React from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { toggleLike } from "@/lib/actions/likes";
import { cn } from "@/lib/utils";

export function LikeButton({
  postId,
  pathname,
  initialLiked,
  initialCount,
  isAuthenticated,
}: {
  postId: string;
  pathname: string;
  initialLiked: boolean;
  initialCount: number;
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const [liked, setLiked] = React.useState(initialLiked);
  const [count, setCount] = React.useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((c) => c + (nextLiked ? 1 : -1));

    startTransition(async () => {
      const result = await toggleLike(postId, pathname);
      if (result?.error) {
        setLiked(!nextLiked);
        setCount((c) => c - (nextLiked ? 1 : -1));
      }
    });
  };

  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className={cn(
        "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        liked
          ? "border-transparent bg-gradient-to-r from-rose-500 to-orange-400 text-white"
          : "border-black/10 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5"
      )}
    >
      <motion.span animate={liked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
        <Heart className={cn("h-4 w-4", liked && "fill-current")} />
      </motion.span>
      {count}
    </button>
  );
}
