import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUnreadMessageCount } from "@/lib/messages";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const unreadMessages = await getUnreadMessageCount(session.user.id);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row">
      <DashboardSidebar user={session.user} unreadMessages={unreadMessages} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
