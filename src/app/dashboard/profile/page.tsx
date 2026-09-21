import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/dashboard/profile-form";

export const metadata: Metadata = { title: "Mon profil" };

export default async function ProfilePage() {
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Mon profil</h1>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        Ces informations sont visibles publiquement sur ton profil.
      </p>

      <div className="mt-8 max-w-xl">
        <ProfileForm
          defaultValues={{
            name: user?.name ?? "",
            bio: user?.bio ?? "",
            image: user?.image ?? "",
          }}
          username={user?.username}
        />
      </div>
    </div>
  );
}
