import { prisma } from "@/lib/prisma";

export async function isFollowing(followerId: string, followingId: string) {
  const follow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });
  return Boolean(follow);
}

export async function areMutualFollowers(userIdA: string, userIdB: string) {
  const [aFollowsB, bFollowsA] = await Promise.all([
    isFollowing(userIdA, userIdB),
    isFollowing(userIdB, userIdA),
  ]);
  return aFollowsB && bFollowsA;
}

const mutualUserSelect = {
  id: true,
  name: true,
  username: true,
  image: true,
} as const;

export async function getMutualFollowers(userId: string) {
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followingIds = following.map((f) => f.followingId);
  if (followingIds.length === 0) return [];

  const mutuals = await prisma.follow.findMany({
    where: { followerId: { in: followingIds }, followingId: userId },
    select: { follower: { select: mutualUserSelect } },
  });
  return mutuals.map((m) => m.follower);
}
