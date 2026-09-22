"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { areMutualFollowers } from "@/lib/social";
import { notifyMessage } from "@/lib/notifications";
import { messageSchema } from "@/lib/validations";

export type MessageActionState = { error?: string };

export async function sendMessage(
  recipientId: string,
  recipientUsername: string,
  _prevState: MessageActionState,
  formData: FormData
): Promise<MessageActionState> {
  const user = await requireUser();

  const parsed = messageSchema.safeParse({ content: String(formData.get("content") ?? "") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Message invalide" };
  }

  const mutual = await areMutualFollowers(user.id, recipientId);
  if (!mutual) {
    return { error: "Vous devez vous suivre mutuellement pour échanger des messages." };
  }

  await prisma.message.create({
    data: { senderId: user.id, recipientId, content: parsed.data.content },
  });
  await notifyMessage(user.id, recipientId);

  revalidatePath(`/dashboard/messages/${recipientUsername}`);
  revalidatePath("/dashboard/messages");
  return {};
}
