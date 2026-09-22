import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getNotificationsForUser, getUnreadNotificationCount } from "@/lib/notifications";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ unreadCount: 0, items: [] }, { status: 401 });
  }

  const [unreadCount, items] = await Promise.all([
    getUnreadNotificationCount(session.user.id),
    getNotificationsForUser(session.user.id),
  ]);

  return NextResponse.json({ unreadCount, items });
}
