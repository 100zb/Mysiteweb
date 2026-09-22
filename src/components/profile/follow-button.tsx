"use client";

import { useState, useTransition } from "react";
import { UserPlus, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFollow } from "@/lib/actions/follow";

export function FollowButton({
  targetUserId,
  targetUsername,
  initialFollowing,
}: {
  targetUserId: string;
  targetUsername: string;
  initialFollowing: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setFollowing((v) => !v);
    startTransition(async () => {
      const result = await toggleFollow(targetUserId, targetUsername);
      if (result.following !== undefined) setFollowing(result.following);
    });
  }

  return (
    <Button
      variant={following ? "outline" : "default"}
      size="sm"
      disabled={isPending}
      onClick={handleClick}
    >
      {following ? (
        <>
          <UserCheck className="h-4 w-4" /> Abonné
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" /> Suivre
        </>
      )}
    </Button>
  );
}
