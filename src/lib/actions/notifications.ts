"use server";

import { requireUser } from "@/lib/auth-helpers";
import { markAllNotificationsReadForUser } from "@/lib/notifications";

export async function markAllNotificationsRead() {
  const user = await requireUser();
  await markAllNotificationsReadForUser(user.id);
  return { success: true };
}
