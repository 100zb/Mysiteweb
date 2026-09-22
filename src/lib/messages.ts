import { prisma } from "@/lib/prisma";

const conversationUserSelect = {
  id: true,
  name: true,
  username: true,
  image: true,
} as const;

export async function getConversations(userId: string) {
  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: userId }, { recipientId: userId }] },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: conversationUserSelect },
      recipient: { select: conversationUserSelect },
    },
  });

  type ConversationUser = (typeof messages)[number]["sender"];
  const conversations = new Map<
    string,
    { user: ConversationUser; lastMessage: (typeof messages)[number]; unreadCount: number }
  >();

  for (const message of messages) {
    const other = message.senderId === userId ? message.recipient : message.sender;
    if (!conversations.has(other.id)) {
      conversations.set(other.id, { user: other, lastMessage: message, unreadCount: 0 });
    }
    if (message.recipientId === userId && !message.readAt) {
      conversations.get(other.id)!.unreadCount += 1;
    }
  }

  return Array.from(conversations.values());
}

export async function getMessages(userId: string, otherUserId: string) {
  return prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: userId },
      ],
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function markMessagesRead(userId: string, otherUserId: string) {
  await prisma.message.updateMany({
    where: { senderId: otherUserId, recipientId: userId, readAt: null },
    data: { readAt: new Date() },
  });
}

export async function getUnreadMessageCount(userId: string) {
  return prisma.message.count({ where: { recipientId: userId, readAt: null } });
}
