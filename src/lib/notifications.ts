import { prisma } from "@/lib/prisma";

export async function notifyFollow(actorId: string, targetUserId: string) {
  if (actorId === targetUserId) return;
  await prisma.notification.create({
    data: { type: "FOLLOW", userId: targetUserId, actorId },
  });
}

export async function notifyNewPost(authorId: string, postId: string) {
  const followers = await prisma.follow.findMany({
    where: { followingId: authorId },
    select: { followerId: true },
  });
  if (followers.length === 0) return;

  await prisma.notification.createMany({
    data: followers.map((f) => ({
      type: "NEW_POST" as const,
      userId: f.followerId,
      actorId: authorId,
      postId,
    })),
  });
}

export async function notifyMessage(actorId: string, recipientId: string) {
  await prisma.notification.create({
    data: { type: "MESSAGE", userId: recipientId, actorId },
  });
}

const notificationSelect = {
  id: true,
  type: true,
  read: true,
  createdAt: true,
  actor: { select: { name: true, username: true, image: true } },
  post: { select: { title: true, slug: true } },
} as const;

export async function getNotificationsForUser(userId: string, take = 20) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
    select: notificationSelect,
  });
}

export async function getUnreadNotificationCount(userId: string) {
  return prisma.notification.count({ where: { userId, read: false } });
}

export async function markAllNotificationsReadForUser(userId: string) {
  await prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
}
