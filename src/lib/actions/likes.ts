"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function toggleLike(postId: string, pathname: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Connecte-toi pour aimer un article." };
  }

  const userId = session.user.id;
  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({ data: { postId, userId } });
  }

  revalidatePath(pathname);
  return { liked: !existing };
}
