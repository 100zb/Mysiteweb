"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { notifyFollow } from "@/lib/notifications";

export async function toggleFollow(
  targetUserId: string,
  targetUsername: string
): Promise<{ error: string; following?: undefined } | { error?: undefined; following: boolean }> {
  const user = await requireUser();
  if (user.id === targetUserId) {
    return { error: "Tu ne peux pas te suivre toi-même." };
  }

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: user.id, followingId: targetUserId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
  } else {
    await prisma.follow.create({ data: { followerId: user.id, followingId: targetUserId } });
    await notifyFollow(user.id, targetUserId);
  }

  revalidatePath(`/profile/${targetUsername}`);
  return { following: !existing };
}
